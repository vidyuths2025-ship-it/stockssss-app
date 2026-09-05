/**
 * Stockssss App — client-side logic. No backend at all: this file fetches
 * data directly from Twelve Data's API (browser-callable, unlike yfinance),
 * runs indicators.js + backtest.js locally, and renders the UI.
 *
 * Everything the app shows is a backtested historical statistic — never a
 * prediction or a guarantee. See the disclaimer text baked into the UI.
 */

const ALL_SIGNALS = ["rsi_oversold_ma_cross", "golden_cross", "macd_bullish_cross"];
const API_KEY_STORAGE = "stockssss_api_key";
const WATCHLIST_STORAGE = "stockssss_watchlist";
const DEFAULT_WATCHLIST = ["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS"];

// ---------------------------- local storage helpers ----------------------------
function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || "";
}
function setApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE, key);
}
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

// ---------------------------- Twelve Data fetch ----------------------------
/**
 * Splits our internal 'SYMBOL.NS' / 'SYMBOL.BO' convention into Twelve
 * Data's { symbol, exchange } params. Non-Indian tickers are passed through
 * as-is (Twelve Data also covers US markets).
 */
function parseTicker(ticker) {
  const m = ticker.match(/^(.*)\.(NS|BO)$/i);
  if (!m) return { symbol: ticker, exchange: null };
  const exchange = m[2].toUpperCase() === "NS" ? "NSE" : "BSE";
  return { symbol: m[1], exchange };
}

async function fetchHistory(ticker) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("No API key set. Open Settings and paste your free Twelve Data API key.");

  const { symbol, exchange } = parseTicker(ticker);
  const params = new URLSearchParams({
    symbol,
    interval: "1day",
    outputsize: "5000", // Twelve Data's max on the free tier — roughly ~20 years of trading days
    apikey: apiKey,
  });
  if (exchange) params.set("exchange", exchange);

  const url = `https://api.twelvedata.com/time_series?${params.toString()}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status === "error" || !data.values) {
    throw new Error(data.message || `Could not fetch data for ${ticker}`);
  }

  // Twelve Data returns newest-first; we need oldest-first for backtesting.
  const rows = [...data.values].reverse();
  const closes = rows.map((r) => parseFloat(r.close));
  const dates = rows.map((r) => r.datetime);
  return { closes, dates };
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

function renderSearchResults(query) {
  const el = document.getElementById("search-results");
  el.innerHTML = "";
  if (!query) return;

  const q = query.toLowerCase();
  const matches = COMPANIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
  ).slice(0, 10);

  if (!matches.length) {
    el.innerHTML = `<div class="no-match">No match in the built-in list. Add the exact ticker manually below.</div>`;
    return;
  }

  const watchlist = getWatchlist();
  matches.forEach((c) => {
    const already = watchlist.includes(c.symbol);
    const row = document.createElement("div");
    row.className = "search-row";
    row.innerHTML = `
      <div class="search-info"><strong>${c.name}</strong><br><span class="gray">${c.symbol}</span></div>
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

  card.innerHTML = `
    <div class="card-header">
      <h3>${SIGNAL_LABELS[result.signal]}</h3>
      ${triggeredBadge}
    </div>
    <div class="win-rate-box" style="background-color:${bg}">
      <div class="win-rate-number">${result.winRate}%</div>
      <div class="win-rate-sub">${label} — higher after ${holdDays} days,<br>in ${result.occurrences} historical occurrences</div>
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
  document.getElementById("api-key-input").value = getApiKey();

  document.getElementById("save-api-key").addEventListener("click", () => {
    setApiKey(document.getElementById("api-key-input").value.trim());
    document.getElementById("settings-panel").classList.add("hidden");
  });
  document.getElementById("settings-toggle").addEventListener("click", () => {
    document.getElementById("settings-panel").classList.toggle("hidden");
  });

  document.getElementById("search-box").addEventListener("input", (e) => {
    renderSearchResults(e.target.value.trim());
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
