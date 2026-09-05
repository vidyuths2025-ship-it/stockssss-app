/**
 * Stockssss App — client-side logic. No backend at all: this file fetches
 * data directly from Twelve Data's API (browser-callable, unlike yfinance),
 * runs indicators.js + backtest.js locally, and renders the UI.
 *
 * Everything the app shows is a backtested historical statistic — never a
 * prediction or a guarantee. See the disclaimer text baked into the UI.
 */

const ALL_SIGNALS = ["rsi_oversold_ma_cross", "golden_cross", "macd_bullish_cross"];
const WATCHLIST_STORAGE = "stockssss_watchlist";
const DEFAULT_WATCHLIST = ["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS"];

// ---------------------------- local storage helpers ----------------------------
function getWatchlist() {
  const raw = localStorage.getItem(WATCHLIST_STORAGE);
  return raw ? JSON.parse(raw) : [...DEFAULT_WATCHLIST];
}
function saveWatchlist(list) {
  localStorage.setItem(WATCHLIST_STORAGE, JSON.stringify(list));
}

// ---------------------------- currency + color helpers ----------------------------
function currencySymbol(ticker) {
  return /\.(NS|BO)$/i.test(ticker) ? "₹" : "$";
}
function winRateColor(winRate) {
  if (winRate >= 60) return { bg: "#1e7e34", label: "Historically favorable" };
  if (winRate <= 40) return { bg: "#c62828", label: "Historically unfavorable" };
  return { bg: "#b8860b", label: "Mixed / no clear edge" };
}

// ---------------------------- Yahoo Finance fetch (via CORS proxy) ----------------------------
/**
 * Yahoo Finance's public chart endpoint (the same data yfinance uses) doesn't
 * allow direct browser calls due to CORS, so we route through a free public
 * CORS-relay service. Two are tried in sequence in case one is down/rate-limited.
 * No API key needed — this is genuinely free, no signup, no daily limit tied to you.
 */
const CORS_PROXIES = [
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

async function fetchHistory(ticker) {
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    ticker
  )}?range=15y&interval=1d`;

  const errors = [];
  for (const buildProxyUrl of CORS_PROXIES) {
    const proxyUrl = buildProxyUrl(yahooUrl);
    try {
      const res = await fetch(proxyUrl);
      if (!res.ok) {
        errors.push(`${new URL(proxyUrl).hostname}: HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();

      const result = data?.chart?.result?.[0];
      if (!result) {
        const msg = data?.chart?.error?.description || "no data in response";
        errors.push(`${new URL(proxyUrl).hostname}: ${msg}`);
        continue;
      }

      const timestamps = result.timestamp;
      const closesRaw = result.indicators.quote[0].close;
      if (!timestamps || !closesRaw) {
        errors.push(`${new URL(proxyUrl).hostname}: incomplete data`);
        continue;
      }

      const closes = [];
      const dates = [];
      for (let i = 0; i < timestamps.length; i++) {
        if (closesRaw[i] === null || closesRaw[i] === undefined) continue;
        closes.push(closesRaw[i]);
        dates.push(new Date(timestamps[i] * 1000).toISOString().slice(0, 10));
      }
      if (closes.length < 60) {
        errors.push(`${new URL(proxyUrl).hostname}: not enough data points (${closes.length})`);
        continue;
      }
      return { closes, dates };
    } catch (err) {
      errors.push(`${new URL(proxyUrl).hostname}: ${err.message}`);
    }
  }
  throw new Error(`All data sources failed — ${errors.join(" | ")}`);
}

// ---------------------------- rendering ----------------------------
let priceChart = null;

function renderWatchlist() {
  const list = getWatchlist();
  const el = document.getElementById("watchlist-items");
  el.innerHTML = "";
  list.forEach((ticker) => {
    const item = document.createElement("div");
    item.className = "watchlist-item";
    item.innerHTML = `<span class="ticker-name">${ticker}</span><button class="remove-btn" data-ticker="${ticker}">✕</button>`;
    item.querySelector(".ticker-name").addEventListener("click", () => selectStock(ticker));
    item.querySelector(".remove-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const updated = getWatchlist().filter((t) => t !== ticker);
      saveWatchlist(updated);
      renderWatchlist();
    });
    el.appendChild(item);
  });

  const select = document.getElementById("stock-select");
  const current = select.value;
  select.innerHTML = list.map((t) => `<option value="${t}">${t}</option>`).join("");
  if (list.includes(current)) select.value = current;
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Live search against Yahoo Finance's public search endpoint — covers any
 * publicly listed stock worldwide, not just the curated companies.js list.
 * Routed through the same CORS relay as price data.
 */
async function searchYahoo(query) {
  const yahooUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
    query
  )}&quotesCount=10&newsCount=0`;

  for (const buildProxyUrl of CORS_PROXIES) {
    try {
      const res = await fetch(buildProxyUrl(yahooUrl));
      const data = await res.json();
      const quotes = data?.quotes || [];
      return quotes
        .filter((q) => q.quoteType === "EQUITY" && q.symbol)
        .map((q) => ({
          symbol: q.symbol,
          name: q.shortname || q.longname || q.symbol,
          exchange: q.exchange,
        }));
    } catch (err) {
      // try next proxy
    }
  }
  return null; // signals total failure so caller can fall back to the local list
}

async function renderSearchResults(query) {
  const el = document.getElementById("search-results");
  if (!query) {
    el.innerHTML = "";
    return;
  }

  el.innerHTML = `<div class="no-match">Searching...</div>`;

  let matches = await searchYahoo(query);
  let usedFallback = false;

  if (matches === null) {
    // live search failed entirely — fall back to the curated local list
    usedFallback = true;
    const q = query.toLowerCase();
    matches = COMPANIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
    ).slice(0, 10);
  }

  el.innerHTML = "";
  if (!matches.length) {
    el.innerHTML = `<div class="no-match">No match found. Add the exact ticker manually below.</div>`;
    return;
  }
  if (usedFallback) {
    const notice = document.createElement("div");
    notice.className = "no-match";
    notice.textContent = "Live search unavailable right now — showing curated list only.";
    el.appendChild(notice);
  }

  const watchlist = getWatchlist();
  matches.forEach((c) => {
    const already = watchlist.includes(c.symbol);
    const row = document.createElement("div");
    row.className = "search-row";
    row.innerHTML = `
      <div class="search-info"><strong>${c.name}</strong><br><span class="gray">${c.symbol}${c.exchange ? " · " + c.exchange : ""}</span></div>
      <button class="add-btn" ${already ? "disabled" : ""}>${already ? "✓" : "＋"}</button>
    `;
    row.querySelector(".add-btn").addEventListener("click", () => {
      const list = getWatchlist();
      if (!list.includes(c.symbol)) {
        list.push(c.symbol);
        saveWatchlist(list);
        renderWatchlist();
        renderSearchResults(query);
      }
    });
    el.appendChild(row);
  });
}

const debouncedSearch = debounce(renderSearchResults, 400);

function renderSignalCard(result, ticker, holdDays) {
  const card = document.createElement("div");
  card.className = "signal-card";

  if (result.occurrences === 0) {
    card.innerHTML = `
      <h3>${SIGNAL_LABELS[result.signal]}</h3>
      <p class="muted">Not enough historical occurrences to compute a statistic.</p>
    `;
    return card;
  }

  const { bg, label } = winRateColor(result.winRate);
  const triggeredBadge = result.currentlyTriggered
    ? `<span class="triggered-badge">🔶 TRIGGERED NOW</span>`
    : "";

  // Expected value: a weighted average of what actually happened historically —
  // (win rate × avg gain) + (loss rate × avg loss). This is a real statistic
  // about the past, not a forecast of what will happen next time.
  const winFrac = result.winRate / 100;
  const gain = result.avgGainPct ?? 0;
  const loss = result.avgLossPct ?? 0;
  const expectedValue = Math.round((winFrac * gain + (1 - winFrac) * loss) * 100) / 100;
  const evColor = expectedValue >= 0 ? "#2e9e4f" : "#e05252";

  card.innerHTML = `
    <div class="card-header">
      <h3>${SIGNAL_LABELS[result.signal]}</h3>
      ${triggeredBadge}
    </div>
    <div class="win-rate-box" style="background-color:${bg}">
      <div class="win-rate-number">${result.winRate}%</div>
      <div class="win-rate-sub">${label} — higher after ${holdDays} days,<br>in ${result.occurrences} historical occurrences</div>
    </div>
    <div class="stat-row" style="font-size:14px;">
      <strong>Historical avg outcome per trade:</strong>
      <span style="color:${evColor}; font-weight:bold;"> ${expectedValue >= 0 ? "+" : ""}${expectedValue}%</span>
    </div>
    <div class="muted small" style="margin-bottom:8px;">
      (win rate × avg gain, blended with loss rate × avg loss — a backtested average, not a forecast)
    </div>
    <div class="stat-row"><strong>Avg gain:</strong> ${result.avgGainPct ?? "—"}%</div>
    <div class="stat-row"><strong>Avg loss:</strong> ${result.avgLossPct ?? "—"}%</div>
    <div class="stat-row"><strong>Max drawdown:</strong> ${result.maxDrawdownPct ?? "—"}%</div>
    ${result.lastOccurrence ? `<div class="muted small">Last occurred: ${result.lastOccurrence}</div>` : ""}
  `;
  return card;
}

function drawChart(dates, closes, sma50, sma200) {
  const ctx = document.getElementById("price-chart").getContext("2d");
  if (priceChart) priceChart.destroy();
  priceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        { label: "Close", data: closes, borderColor: "#4C78A8", pointRadius: 0, borderWidth: 1.5 },
        { label: "SMA 50", data: sma50, borderColor: "orange", pointRadius: 0, borderWidth: 1 },
        { label: "SMA 200", data: sma200, borderColor: "red", pointRadius: 0, borderWidth: 1 },
      ],
    },
    options: {
      responsive: true,
      animation: false,
      scales: { x: { display: false } },
      plugins: { legend: { position: "top" } },
    },
  });
}

async function selectStock(ticker) {
  document.getElementById("stock-select").value = ticker;
  const status = document.getElementById("status");
  const resultsEl = document.getElementById("signal-cards");
  resultsEl.innerHTML = "";
  status.textContent = `Fetching data for ${ticker}...`;
  status.className = "";

  const holdDays = parseInt(document.getElementById("hold-days").value, 10);

  try {
    const { closes, dates } = await fetchHistory(ticker);
    if (closes.length < 60) {
      throw new Error("Not enough historical data returned for this ticker.");
    }

    const price = closes[closes.length - 1];
    document.getElementById("current-price").textContent = `${currencySymbol(ticker)}${price.toFixed(2)}`;

    const ind = addAllIndicators(closes);
    drawChart(dates, closes, ind.sma50, ind.sma200);

    status.textContent = "";
    ALL_SIGNALS.forEach((sig) => {
      const result = runBacktest(closes, dates, sig, holdDays);
      resultsEl.appendChild(renderSignalCard(result, ticker, holdDays));
    });
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
    status.className = "error";
  }
}

// ---------------------------- wiring ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("search-box").addEventListener("input", (e) => {
    debouncedSearch(e.target.value.trim());
  });

  document.getElementById("add-exact-ticker").addEventListener("click", () => {
    const input = document.getElementById("exact-ticker-input");
    const ticker = input.value.trim().toUpperCase();
    if (!ticker) return;
    const list = getWatchlist();
    if (!list.includes(ticker)) {
      list.push(ticker);
      saveWatchlist(list);
      renderWatchlist();
    }
    input.value = "";
  });

  document.getElementById("stock-select").addEventListener("change", (e) => selectStock(e.target.value));
  document.getElementById("hold-days").addEventListener("change", () => {
    const current = document.getElementById("stock-select").value;
    if (current) selectStock(current);
  });

  renderWatchlist();
  const list = getWatchlist();
  if (list.length) selectStock(list[0]);
});
