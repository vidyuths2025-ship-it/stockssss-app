/**
 * Technical indicator calculations — direct JS port of the Python indicators.py.
 * All functions take an array of numbers (closing prices, oldest first) and
 * return an array of the same length (with nulls where there isn't enough
 * history yet to compute a value).
 */

function sma(closes, window) {
  const out = new Array(closes.length).fill(null);
  let sum = 0;
  for (let i = 0; i < closes.length; i++) {
    sum += closes[i];
    if (i >= window) sum -= closes[i - window];
    if (i >= window - 1) out[i] = sum / window;
  }
  return out;
}

function ema(closes, window) {
  const out = new Array(closes.length).fill(null);
  const k = 2 / (window + 1);
  let prev = null;
  for (let i = 0; i < closes.length; i++) {
    if (prev === null) {
      prev = closes[i];
    } else {
      prev = closes[i] * k + prev * (1 - k);
    }
    out[i] = prev;
  }
  return out;
}

function rsi(closes, window = 14) {
  const out = new Array(closes.length).fill(null);
  const gains = new Array(closes.length).fill(0);
  const losses = new Array(closes.length).fill(0);

  for (let i = 1; i < closes.length; i++) {
    const delta = closes[i] - closes[i - 1];
    gains[i] = Math.max(delta, 0);
    losses[i] = Math.max(-delta, 0);
  }

  let avgGain = null;
  let avgLoss = null;
  const alpha = 1 / window;

  for (let i = 0; i < closes.length; i++) {
    if (i < window) continue;
    if (avgGain === null) {
      // seed with simple average of first `window` gains/losses
      let g = 0, l = 0;
      for (let j = 1; j <= window; j++) {
        g += gains[j];
        l += losses[j];
      }
      avgGain = g / window;
      avgLoss = l / window;
    } else {
      avgGain = gains[i] * alpha + avgGain * (1 - alpha);
      avgLoss = losses[i] * alpha + avgLoss * (1 - alpha);
    }
    if (avgLoss === 0) {
      out[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      out[i] = 100 - 100 / (1 + rs);
    }
  }
  return out;
}

function macd(closes, fast = 12, slow = 26, signal = 9) {
  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);
  const macdLine = closes.map((_, i) =>
    emaFast[i] !== null && emaSlow[i] !== null ? emaFast[i] - emaSlow[i] : null
  );
  const signalLine = ema(
    macdLine.map((v) => (v === null ? 0 : v)),
    signal
  );
  const histogram = macdLine.map((v, i) =>
    v !== null && signalLine[i] !== null ? v - signalLine[i] : null
  );
  return { macdLine, signalLine, histogram };
}

function addAllIndicators(closes) {
  const { macdLine, signalLine } = macd(closes);
  return {
    sma50: sma(closes, 50),
    sma200: sma(closes, 200),
    rsi14: rsi(closes, 14),
    macdLine,
    macdSignal: signalLine,
  };
}
