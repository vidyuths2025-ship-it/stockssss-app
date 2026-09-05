# Stockssss App — Netlify static version (no backend, no laptop needed)

This is a completely different build from the `backend/` + `mobile/` and
`streamlit_app/` folders: it's a plain website (HTML/CSS/JS) that runs
entirely in the browser and talks directly to a stock-data API. No Python,
no server, no Flutter, no Android Studio. Once deployed, it works from any
device, anytime — your laptop doesn't need to be on.

## Step 1 — Get a free API key (2 minutes)

yfinance (used in the other versions) can't be called directly from a
browser — it blocks that for security reasons (CORS). So this version uses
**Twelve Data** instead, which allows direct browser calls and has a
generous free tier (800 requests/day) that covers NSE and BSE stocks.

1. Go to https://twelvedata.com/pricing and sign up for the **free** plan
   (no credit card required).
2. After signing up, your API key is shown on your dashboard. Copy it.

## Step 2 — Deploy to Netlify (drag and drop, no GitHub needed)

1. Go to https://app.netlify.com/drop
2. Drag the entire `netlify_app` folder (this folder) onto the page.
3. Netlify uploads it and gives you a live URL immediately, like
   `https://random-name-123.netlify.app`.
4. (Optional) In Netlify's site settings, click "Change site name" to pick
   something like `stockssss-app` for a nicer URL.

That's it — no build step, no config, because this is just static files.

## Step 3 — Add your API key in the app itself

1. Open your new Netlify URL.
2. Click the **⚙ Settings** button in the sidebar.
3. Paste your Twelve Data API key and click **Save key**.

The key is stored only in your browser (localStorage) — it's never sent
anywhere except directly to Twelve Data's API when fetching prices.

## Step 4 — Get a real icon on your phone

1. Open the Netlify URL on your phone's browser (Chrome on Android, Safari
   on iOS).
2. Chrome: tap the three-dot menu → "Add to Home screen".
   Safari: tap the Share icon → "Add to Home Screen".
3. You'll get a real icon that opens the app directly, full-screen, no
   browser address bar — this works from anywhere, without your laptop,
   because the app is now hosted on Netlify's servers, not your machine.

## What's different from the other versions

- **No backend** — all the indicator math and backtesting (previously in
  `backend/indicators.py` and `backend/backtest.py`) has been ported to
  `indicators.js` and `backtest.js`, running right in the browser.
- **Data source is Twelve Data, not yfinance** — because yfinance blocks
  direct browser calls. Free tier gives ~20 years of history (5000 daily
  bars), not the full 30 — a real tradeoff of skipping a backend.
- **Search covers the same 176 curated NSE companies** as the Streamlit
  version (`companies.js`, generated from the same list).
- **Rate limits**: Twelve Data's free tier allows 8 requests/minute — fine
  for personal browsing, but don't rapid-click between many stocks.

## Files

```
netlify_app/
  index.html        the page structure
  style.css         dark theme styling
  app.js            state, API calls, rendering logic
  indicators.js      SMA/EMA/RSI/MACD, ported from backend/indicators.py
  backtest.js        backtest engine, ported from backend/backtest.py
  companies.js       searchable company list (same data as companies.csv)
  manifest.json      makes "Add to Home Screen" behave like a real app
  icon-192.png / icon-512.png   app icons for the home screen
```
