/**
 * Backtest engine — direct JS port of backend/backtest.py.
 * Finds every historical occurrence of a signal condition and measures
 * what happened to price `holdDays` later. Every number here describes
 * the past only — never a prediction.
 */

const SIGNAL_LABELS = {
  rsi_oversold_ma_cross: "RSI Oversold + MA Cross",
  golden_cross: "Golden Cross (50/200 MA)",
  macd_bullish_cross: "MACD Bullish Cross",
};

function findSignalDates(closes, ind, signal) {
  const n = closes.length;
  const fired = new Array(n).fill(false);

  if (signal === "rsi_oversold_ma_cross") {
    for (let i = 2; i < n; i++) {
      const recentRsi = [ind.rsi14[i], ind.rsi14[i - 1], ind.rsi14[i - 2]];
      const wasOversold = recentRsi.some((v) => v !== null && v < 30);
      const crossUp =
        ind.sma50[i] !== null &&
        ind.sma50[i - 1] !== null &&
        closes[i] > ind.sma50[i] &&
        closes[i - 1] <= ind.sma50[i - 1];
      fired[i] = wasOversold && crossUp;
    }
  } else if (signal === "golden_cross") {
    for (let i = 1; i < n; i++) {
      if (
        ind.sma50[i] !== null &&
        ind.sma200[i] !== null &&
        ind.sma50[i - 1] !== null &&
        ind.sma200[i - 1] !== null
      ) {
        fired[i] = ind.sma50[i] > ind.sma200[i] && ind.sma50[i - 1] <= ind.sma200[i - 1];
      }
    }
  } else if (signal === "macd_bullish_cross") {
    for (let i = 1; i < n; i++) {
      if (
        ind.macdLine[i] !== null &&
        ind.macdSignal[i] !== null &&
        ind.macdLine[i - 1] !== null &&
        ind.macdSignal[i - 1] !== null
      ) {
        fired[i] = ind.macdLine[i] > ind.macdSignal[i] && ind.macdLine[i - 1] <= ind.macdSignal[i - 1];
      }
    }
  }
  return fired;
}

function maxDrawdown(returnsPct) {
  if (!returnsPct.length) return null;
  let equity = 1;
  let peak = 1;
  let worstDD = 0;
  for (const r of returnsPct) {
    equity *= 1 + r / 100;
    peak = Math.max(peak, equity);
    worstDD = Math.min(worstDD, (equity - peak) / peak);
  }
  return worstDD * 100;
}

/**
 * closes: array of closing prices, oldest first
 * dates: array of ISO date strings aligned with closes
 */
function runBacktest(closes, dates, signal, holdDays = 20) {
  const ind = addAllIndicators(closes);
  const fired = findSignalDates(closes, ind, signal);

  const outcomes = [];
  let lastOccurrence = null;
  for (let i = 0; i < closes.length; i++) {
    if (!fired[i]) continue;
    lastOccurrence = dates[i];
    const exitIdx = i + holdDays;
    if (exitIdx >= closes.length) continue;
    const pctChange = ((closes[exitIdx] - closes[i]) / closes[i]) * 100;
    outcomes.push(pctChange);
  }

  const currentlyTriggered = fired.length ? fired[fired.length - 1] : false;

  if (!outcomes.length) {
    return {
      signal,
      holdDays,
      occurrences: 0,
      winRate: null,
      avgGainPct: null,
      avgLossPct: null,
      bestPct: null,
      worstPct: null,
      maxDrawdownPct: null,
      lastOccurrence,
      currentlyTriggered,
    };
  }

  const wins = outcomes.filter((o) => o > 0);
  const losses = outcomes.filter((o) => o <= 0);
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

  return {
    signal,
    holdDays,
    occurrences: outcomes.length,
    winRate: Math.round((wins.length / outcomes.length) * 1000) / 10,
    avgGainPct: wins.length ? Math.round(avg(wins) * 100) / 100 : null,
    avgLossPct: losses.length ? Math.round(avg(losses) * 100) / 100 : null,
    bestPct: Math.round(Math.max(...outcomes) * 100) / 100,
    worstPct: Math.round(Math.min(...outcomes) * 100) / 100,
    maxDrawdownPct: Math.round(maxDrawdown(outcomes) * 100) / 100,
    lastOccurrence,
    currentlyTriggered,
  };
}
