import { FormState, TradingSystem, TradingSystemSection } from "../types";

function detectIndicators(idea: string): string[] {
  const lower = idea.toLowerCase();
  const found: string[] = [];
  if (lower.includes("rsi")) found.push("RSI");
  if (lower.includes("macd")) found.push("MACD");
  if (lower.includes("bollinger") || lower.includes("bb")) found.push("Bollinger Bands");
  if (lower.includes("ema") || lower.includes("exponential")) found.push("EMA");
  if (lower.includes("sma") || lower.includes("moving average") || lower.includes("ma cross")) found.push("SMA");
  if (lower.includes("stochastic") || lower.includes("stoch")) found.push("Stochastic");
  if (lower.includes("atr")) found.push("ATR");
  if (lower.includes("vwap")) found.push("VWAP");
  if (lower.includes("supertrend")) found.push("SuperTrend");
  if (lower.includes("ichimoku")) found.push("Ichimoku Cloud");
  if (lower.includes("fibonacci") || lower.includes("fib")) found.push("Fibonacci Retracement");
  if (lower.includes("volume")) found.push("Volume");
  if (lower.includes("breakout")) found.push("Breakout Detection");
  if (lower.includes("momentum")) found.push("Momentum");
  if (found.length === 0) found.push("EMA", "RSI", "ATR");
  return found;
}

function detectMarketInstruments(market: string, idea: string): { market: string; instruments: string[] } {
  const lower = market.toLowerCase();
  const ideaLower = idea.toLowerCase();
  if (lower.includes("crypto") || ideaLower.includes("crypto") || ideaLower.includes("bitcoin") || ideaLower.includes("btc")) {
    return { market: "Cryptocurrency", instruments: ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT"] };
  }
  if (lower.includes("forex") || ideaLower.includes("forex") || ideaLower.includes("eur/usd") || ideaLower.includes("fx")) {
    return { market: "Forex", instruments: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"] };
  }
  if (lower.includes("stock") || lower.includes("equity") || ideaLower.includes("stock") || ideaLower.includes("nasdaq") || ideaLower.includes("spy")) {
    return { market: "Equities", instruments: ["SPY", "QQQ", "AAPL", "TSLA", "MSFT"] };
  }
  if (lower.includes("futures") || lower.includes("commodity") || ideaLower.includes("gold") || ideaLower.includes("crude")) {
    return { market: "Futures / Commodities", instruments: ["ES (S&P 500 Futures)", "NQ (Nasdaq Futures)", "GC (Gold)", "CL (Crude Oil)"] };
  }
  if (lower.includes("option") || ideaLower.includes("option")) {
    return { market: "Options", instruments: ["SPY Options", "QQQ Options", "TSLA Options", "Index Options"] };
  }
  return { market: "Equities / Crypto (hybrid)", instruments: ["SPY", "QQQ", "BTC/USDT", "ETH/USDT"] };
}

function getTimeframe(style: string): { primary: string; secondary: string } {
  switch (style) {
    case "scalping": return { primary: "1m – 5m", secondary: "15m (trend filter)" };
    case "day": return { primary: "5m – 15m", secondary: "1H (trend bias)" };
    case "swing": return { primary: "4H – Daily", secondary: "Weekly (trend filter)" };
    case "position": return { primary: "Daily – Weekly", secondary: "Monthly (macro trend)" };
    default: return { primary: "15m – 1H", secondary: "4H (trend filter)" };
  }
}

function getBrokers(country: string, market: string): string[] {
  const lower = country.toLowerCase();
  const mkt = market.toLowerCase();
  const crypto = mkt.includes("crypto");
  const forex = mkt.includes("forex");
  if (lower.includes("us") || lower.includes("united states")) {
    if (crypto) return ["Coinbase Advanced", "Kraken", "Binance.US", "Interactive Brokers (crypto ETF)"];
    if (forex) return ["OANDA", "TD Ameritrade (thinkorswim)", "Interactive Brokers", "FOREX.com"];
    return ["Interactive Brokers", "TD Ameritrade", "Alpaca (commission-free API)", "TradeStation"];
  }
  if (lower.includes("uk") || lower.includes("united kingdom")) {
    if (crypto) return ["Coinbase", "Kraken", "Bitstamp", "IG Markets"];
    return ["IG Markets", "CMC Markets", "Interactive Brokers UK", "Saxo Bank"];
  }
  if (lower.includes("india")) {
    return ["Zerodha (Kite Connect API)", "Angel One (SmartAPI)", "Upstox API", "Fyers API"];
  }
  if (lower.includes("eu") || lower.includes("europe")) {
    return ["Interactive Brokers", "Saxo Bank", "IG Markets", "DEGIRO"];
  }
  if (lower.includes("australia")) {
    return ["Interactive Brokers AU", "CommSec", "IG AU", "Stake"];
  }
  return ["Interactive Brokers (global)", "Alpaca", "Binance (crypto)", "OANDA (forex)"];
}

function getRiskParams(riskLevel: string, capital: string): { stopLoss: string; takeProfit: string; posSize: string; maxDaily: string; rr: string } {
  const cap = parseFloat(capital.replace(/[^0-9.]/g, "")) || 10000;
  switch (riskLevel) {
    case "low":
      return {
        stopLoss: "0.5% – 1% of trade value",
        takeProfit: "1.5% – 2% of trade value",
        posSize: `1% of capital per trade (~$${(cap * 0.01).toFixed(0)})`,
        maxDaily: `2% of total capital (~$${(cap * 0.02).toFixed(0)})`,
        rr: "1:2",
      };
    case "medium":
      return {
        stopLoss: "1% – 2% of trade value",
        takeProfit: "2% – 4% of trade value",
        posSize: `2% of capital per trade (~$${(cap * 0.02).toFixed(0)})`,
        maxDaily: `4% of total capital (~$${(cap * 0.04).toFixed(0)})`,
        rr: "1:2 to 1:3",
      };
    case "high":
      return {
        stopLoss: "2% – 3% of trade value",
        takeProfit: "4% – 9% of trade value",
        posSize: `3% of capital per trade (~$${(cap * 0.03).toFixed(0)})`,
        maxDaily: `6% of total capital (~$${(cap * 0.06).toFixed(0)})`,
        rr: "1:3",
      };
    default:
      return {
        stopLoss: "1.5% of trade value",
        takeProfit: "3% of trade value",
        posSize: `2% of capital per trade (~$${(cap * 0.02).toFixed(0)})`,
        maxDaily: `4% of total capital (~$${(cap * 0.04).toFixed(0)})`,
        rr: "1:2",
      };
  }
}

function buildPseudocode(indicators: string[], style: string): string {
  const ind = indicators.join(", ");
  return `# ─── Strategy Entry / Exit Logic ───────────────────────────
# Indicators used: ${ind}
# Timeframe: ${getTimeframe(style).primary}

def generate_signal(df: pd.DataFrame) -> pd.Series:
    """
    Returns a Series of signals: 1 = BUY, -1 = SELL, 0 = HOLD
    """
    signals = pd.Series(0, index=df.index)

    # ── Compute Indicators ──────────────────────────────────
${indicators.includes("EMA") || indicators.includes("SMA") ? `    df['ema_fast'] = df['close'].ewm(span=9,  adjust=False).mean()
    df['ema_slow'] = df['close'].ewm(span=21, adjust=False).mean()` : ""}
${indicators.includes("RSI") ? `    delta   = df['close'].diff()
    gain    = delta.clip(lower=0).rolling(14).mean()
    loss    = (-delta.clip(upper=0)).rolling(14).mean()
    rs      = gain / loss
    df['rsi'] = 100 - (100 / (1 + rs))` : ""}
${indicators.includes("MACD") ? `    ema12       = df['close'].ewm(span=12, adjust=False).mean()
    ema26       = df['close'].ewm(span=26, adjust=False).mean()
    df['macd']  = ema12 - ema26
    df['signal_line'] = df['macd'].ewm(span=9, adjust=False).mean()` : ""}
${indicators.includes("Bollinger Bands") ? `    df['bb_mid']   = df['close'].rolling(20).mean()
    df['bb_std']   = df['close'].rolling(20).std()
    df['bb_upper'] = df['bb_mid'] + 2 * df['bb_std']
    df['bb_lower'] = df['bb_mid'] - 2 * df['bb_std']` : ""}
${indicators.includes("ATR") ? `    high_low  = df['high'] - df['low']
    high_prev = (df['high'] - df['close'].shift()).abs()
    low_prev  = (df['low']  - df['close'].shift()).abs()
    tr        = pd.concat([high_low, high_prev, low_prev], axis=1).max(axis=1)
    df['atr'] = tr.rolling(14).mean()` : ""}
${indicators.includes("VWAP") ? `    df['vwap'] = (df['close'] * df['volume']).cumsum() / df['volume'].cumsum()` : ""}

    # ── Entry Conditions ────────────────────────────────────
    long_condition  = (
${indicators.includes("EMA") || indicators.includes("SMA") ? `        (df['ema_fast'] > df['ema_slow'])` : `        (df['close'] > df['close'].rolling(20).mean())`}
${indicators.includes("RSI") ? `        & (df['rsi'] > 30) & (df['rsi'] < 70)` : ""}
${indicators.includes("MACD") ? `        & (df['macd'] > df['signal_line'])` : ""}
${indicators.includes("Bollinger Bands") ? `        & (df['close'] > df['bb_lower'])` : ""}
${indicators.includes("VWAP") ? `        & (df['close'] > df['vwap'])` : ""}
    )

    short_condition = (
${indicators.includes("EMA") || indicators.includes("SMA") ? `        (df['ema_fast'] < df['ema_slow'])` : `        (df['close'] < df['close'].rolling(20).mean())`}
${indicators.includes("RSI") ? `        & (df['rsi'] < 70) & (df['rsi'] > 30)` : ""}
${indicators.includes("MACD") ? `        & (df['macd'] < df['signal_line'])` : ""}
${indicators.includes("Bollinger Bands") ? `        & (df['close'] < df['bb_upper'])` : ""}
${indicators.includes("VWAP") ? `        & (df['close'] < df['vwap'])` : ""}
    )

    signals[long_condition]  =  1   # BUY
    signals[short_condition] = -1   # SELL
    return signals`;
}

function buildFetchCode(market: string): string {
  const isCrypto = market.toLowerCase().includes("crypto");
  if (isCrypto) {
    return `import ccxt
import pandas as pd

def fetch_ohlcv(symbol: str = "BTC/USDT",
                timeframe: str = "1h",
                limit: int = 500) -> pd.DataFrame:
    """Fetch OHLCV data from Binance via ccxt."""
    exchange = ccxt.binance({"enableRateLimit": True})
    bars = exchange.fetch_ohlcv(symbol, timeframe=timeframe, limit=limit)
    df = pd.DataFrame(bars, columns=["timestamp","open","high","low","close","volume"])
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
    df.set_index("timestamp", inplace=True)
    return df

# ── Live WebSocket stream (Binance) ──────────────────────
import websocket, json

def on_message(ws, message):
    data = json.loads(message)
    candle = data["k"]
    if candle["x"]:          # candle closed
        close = float(candle["c"])
        print(f"Closed candle: {close}")

ws_url = "wss://stream.binance.com:9443/ws/btcusdt@kline_1m"
ws = websocket.WebSocketApp(ws_url, on_message=on_message)
ws.run_forever()`;
  }
  return `import yfinance as yf
import pandas as pd

def fetch_ohlcv(ticker: str = "SPY",
                period: str = "6mo",
                interval: str = "1d") -> pd.DataFrame:
    """Fetch historical OHLCV from Yahoo Finance (free)."""
    df = yf.download(ticker, period=period, interval=interval)
    df.rename(columns=str.lower, inplace=True)
    return df

# ── Alternative: Alpaca Markets (live + paper) ──────────
from alpaca_trade_api.rest import REST
import os

api = REST(
    key_id    = os.getenv("ALPACA_KEY"),
    secret_key= os.getenv("ALPACA_SECRET"),
    base_url  = "https://paper-api.alpaca.markets"   # paper trading
)

bars = api.get_bars("AAPL", "1Hour", limit=200).df
bars.rename(columns=str.lower, inplace=True)
print(bars.tail())`;
}

function buildExecutionCode(market: string): string {
  const isCrypto = market.toLowerCase().includes("crypto");
  if (isCrypto) {
    return `import ccxt, os

exchange = ccxt.binance({
    "apiKey":  os.getenv("BINANCE_API_KEY"),
    "secret":  os.getenv("BINANCE_SECRET"),
    "enableRateLimit": True,
    # "options": {"defaultType": "future"},  # uncomment for futures
})

# ── Place a Market Buy Order ─────────────────────────────
def place_order(symbol: str, side: str, amount: float):
    try:
        order = exchange.create_market_order(symbol, side, amount)
        print(f"[ORDER] {side.upper()} {amount} {symbol} → {order['id']}")
        return order
    except ccxt.InsufficientFunds as e:
        print(f"[ERROR] Insufficient funds: {e}")
    except ccxt.NetworkError as e:
        print(f"[ERROR] Network issue: {e}")
    except Exception as e:
        print(f"[ERROR] Unexpected: {e}")

# ── Paper / Sandbox mode ─────────────────────────────────
# For paper trading, use Binance testnet:
# exchange.set_sandbox_mode(True)

# ── Example Usage ────────────────────────────────────────
# place_order("BTC/USDT", "buy",  0.001)
# place_order("BTC/USDT", "sell", 0.001)`;
  }
  return `from alpaca_trade_api.rest import REST, TimeFrame
import os

api = REST(
    key_id    = os.getenv("ALPACA_KEY"),
    secret_key= os.getenv("ALPACA_SECRET"),
    base_url  = "https://paper-api.alpaca.markets"   # use live URL in prod
)

def place_order(symbol: str, qty: int, side: str,
                stop_price: float = None, take_profit: float = None):
    """Place a bracket order with stop-loss and take-profit."""
    try:
        order = api.submit_order(
            symbol         = symbol,
            qty            = qty,
            side           = side,
            type           = "market",
            time_in_force  = "day",
            order_class    = "bracket",
            stop_loss      = {"stop_price": str(stop_price)}  if stop_price  else None,
            take_profit    = {"limit_price": str(take_profit)} if take_profit else None,
        )
        print(f"[ORDER] {side.upper()} {qty} {symbol} → {order.id}")
        return order
    except Exception as e:
        print(f"[ERROR] Order failed: {e}")

# ── Example ──────────────────────────────────────────────
# place_order("AAPL", 10, "buy", stop_price=148.00, take_profit=158.00)`;
}

function buildBacktestCode(_indicators: string[]): string {
  return `import pandas as pd
import numpy as np

def backtest(df: pd.DataFrame,
             signals: pd.Series,
             initial_capital: float = 10_000,
             risk_per_trade: float  = 0.02) -> dict:
    """
    Simple vectorised back-tester.
    signals: 1 = BUY, -1 = SELL, 0 = HOLD
    """
    position     = 0
    capital      = initial_capital
    equity_curve = [capital]
    trades       = []
    entry_price  = 0.0

    for i in range(1, len(df)):
        price = df["close"].iloc[i]
        sig   = signals.iloc[i]

        if sig == 1 and position == 0:          # ── Enter Long
            size        = (capital * risk_per_trade) / price
            position    = size
            entry_price = price

        elif sig == -1 and position > 0:        # ── Exit Long
            pnl      = position * (price - entry_price)
            capital += pnl
            trades.append({
                "entry": entry_price,
                "exit":  price,
                "pnl":   pnl,
                "return": (price - entry_price) / entry_price,
            })
            position = 0

        equity_curve.append(capital)

    # ── Metrics ──────────────────────────────────────────
    trades_df   = pd.DataFrame(trades)
    total_ret   = (capital - initial_capital) / initial_capital * 100
    win_rate    = (trades_df["pnl"] > 0).mean() * 100 if len(trades_df) else 0
    eq          = pd.Series(equity_curve)
    rolling_max = eq.cummax()
    drawdown    = ((eq - rolling_max) / rolling_max).min() * 100
    daily_ret   = eq.pct_change().dropna()
    sharpe      = (daily_ret.mean() / daily_ret.std()) * np.sqrt(252) if daily_ret.std() > 0 else 0

    return {
        "total_trades":    len(trades_df),
        "win_rate_%":      round(win_rate, 2),
        "total_return_%":  round(total_ret, 2),
        "max_drawdown_%":  round(drawdown, 2),
        "sharpe_ratio":    round(sharpe, 2),
        "final_capital":   round(capital, 2),
    }

# ── Run It ───────────────────────────────────────────────
# df       = fetch_ohlcv(...)
# signals  = generate_signal(df)
# results  = backtest(df, signals)
# print(results)`;
}

function buildDeployCode(): string {
  return `# ── requirements.txt ─────────────────────────────────────
# pandas>=2.0  numpy>=1.26  ccxt>=4  yfinance  alpaca-trade-api
# python-dotenv  requests  schedule  websocket-client

# ── .env  (NEVER commit this file!) ──────────────────────
# BINANCE_API_KEY=xxxx
# BINANCE_SECRET=xxxx
# ALPACA_KEY=xxxx
# ALPACA_SECRET=xxxx
# TELEGRAM_TOKEN=xxxx
# TELEGRAM_CHAT_ID=xxxx

# ── main.py — run locally or on a VPS/AWS EC2 ────────────
import schedule, time, logging, requests, os
from dotenv import load_dotenv
load_dotenv()

logging.basicConfig(
    level    = logging.INFO,
    format   = "%(asctime)s  %(levelname)s  %(message)s",
    handlers = [logging.FileHandler("tradeforge.log"),
                logging.StreamHandler()]
)

def send_telegram(msg: str):
    token   = os.getenv("TELEGRAM_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    url     = f"https://api.telegram.org/bot{token}/sendMessage"
    requests.post(url, json={"chat_id": chat_id, "text": msg})

def run_strategy():
    try:
        logging.info("Fetching data …")
        df      = fetch_ohlcv()
        signals = generate_signal(df)
        last    = signals.iloc[-1]

        if last == 1:
            logging.info("SIGNAL: BUY")
            send_telegram("🟢 TradeForge BUY signal detected!")
            place_order(...)

        elif last == -1:
            logging.info("SIGNAL: SELL")
            send_telegram("🔴 TradeForge SELL signal detected!")
            place_order(...)

        else:
            logging.info("No signal — holding.")

    except Exception as e:
        logging.error(f"Strategy error: {e}")
        send_telegram(f"⚠️ Strategy error: {e}")

# ── Schedule every 15 minutes ────────────────────────────
schedule.every(15).minutes.do(run_strategy)

if __name__ == "__main__":
    logging.info("TradeForge AI started 🚀")
    run_strategy()
    while True:
        schedule.run_pending()
        time.sleep(1)

# ── GitHub Actions CI (optional, .github/workflows/trade.yml)
# on: schedule: cron: '*/15 * * * *'
# runs-on: ubuntu-latest
# steps: pip install -r requirements.txt && python main.py`;
}

export function generateTradingSystem(form: FormState): TradingSystem {
  const indicators = detectIndicators(form.idea);
  const { market, instruments } = detectMarketInstruments(form.market, form.idea);
  const timeframe = getTimeframe(form.style);
  const brokers = getBrokers(form.country, market);
  const risk = getRiskParams(form.riskLevel, form.capital);
  const styleLabel: Record<string, string> = {
    scalping: "Scalping", day: "Day Trading", swing: "Swing Trading", position: "Position Trading", algo: "Algorithmic / Quant",
  };
  const riskLabel: Record<string, string> = { low: "🟢 Low", medium: "🟡 Medium", high: "🔴 High" };

  const sections: TradingSystemSection[] = [
    {
      id: "overview",
      title: "📋 Overview",
      icon: "📋",
      content: `**Strategy Summary**
Your trading idea: *"${form.idea}"*

This system has been analysed and structured into a complete, executable trading framework.

| Parameter | Value |
|---|---|
| **Market** | ${market} |
| **Instruments** | ${instruments.join(", ")} |
| **Primary Timeframe** | ${timeframe.primary} |
| **Confirmation Timeframe** | ${timeframe.secondary} |
| **Trading Style** | ${styleLabel[form.style] || form.style} |
| **Risk Level** | ${riskLabel[form.riskLevel] || form.riskLevel} |
| **Starting Capital** | ${form.capital || "Not specified"} |
| **Indicators Detected** | ${indicators.join(", ")} |`,
    },
    {
      id: "setup",
      title: "🛠️ Setup & Environment",
      icon: "🛠️",
      content: `**Recommended Brokers** (${form.country || "Global"})
${brokers.map((b, i) => `${i + 1}. **${b}**`).join("\n")}

**Python Version:** 3.11+

**Key Libraries**
\`\`\`
pandas>=2.0          # Data manipulation
numpy>=1.26          # Numerical computing
yfinance             # Free stock/ETF data (Yahoo Finance)
ccxt>=4.0            # 100+ crypto exchange APIs
alpaca-trade-api     # US equities & crypto paper/live trading
ta-lib               # 150+ technical indicators (C-based, fast)
python-dotenv        # Secure API key management
schedule             # Job scheduling
websocket-client     # Real-time WebSocket feeds
requests             # HTTP / Telegram alerts
\`\`\``,
      code: `# ── Install everything in one shot ──────────────────────
pip install pandas numpy yfinance ccxt alpaca-trade-api \\
            python-dotenv schedule websocket-client requests

# ── Optional: TA-Lib (needs C build tools) ────────────
# macOS:   brew install ta-lib && pip install TA-Lib
# Ubuntu:  sudo apt install libta-lib-dev && pip install TA-Lib
# Windows: download wheel from https://pypi.org/simple/ta-lib/

# ── Project structure ─────────────────────────────────
tradeforge/
├── .env               # API keys  (git-ignored!)
├── main.py            # Entry point / scheduler
├── strategy.py        # Indicators + signal logic
├── data.py            # Fetch & store OHLCV
├── execution.py       # Order placement
├── backtest.py        # Back-testing engine
├── requirements.txt
└── logs/
    └── tradeforge.log`,
      language: "bash",
    },
    {
      id: "data",
      title: "📊 Data Fetching & Storage",
      icon: "📊",
      content: `**Historical Data Sources**
| Source | Type | Cost | Best For |
|---|---|---|---|
| Yahoo Finance (yfinance) | Stocks, ETFs, indices | Free | Backtesting equities |
| Binance (ccxt) | Crypto OHLCV | Free | Crypto backtesting & live |
| Alpaca Markets | US equities | Free (paper + live) | US stocks algo trading |
| Alpha Vantage | Stocks + forex | Free / Paid | Fundamentals + OHLCV |
| Polygon.io | Stocks + options | Paid (~$29/mo) | Professional data |

**Storage Options**
- **CSV** — Simple, great for backtesting small datasets
- **SQLite** — Lightweight local database, no server needed
- **PostgreSQL / TimescaleDB** — Production grade, time-series optimised
- **Parquet** — Fast compressed columnar format (pandas-compatible)`,
      code: buildFetchCode(market),
      language: "python",
    },
    {
      id: "strategy",
      title: "🧠 Strategy Logic",
      icon: "🧠",
      content: `**Indicators Detected:** ${indicators.join(" · ")}

**Entry Rules (LONG)**
${indicators.includes("EMA") || indicators.includes("SMA") ? "- Fast EMA crosses **above** Slow EMA (trend confirmation)" : "- Price breaks above 20-period SMA"}
${indicators.includes("RSI") ? "- RSI is between **30 and 70** (not overbought/oversold)" : ""}
${indicators.includes("MACD") ? "- MACD line crosses **above** Signal line (momentum confirmation)" : ""}
${indicators.includes("Bollinger Bands") ? "- Price bounces off **lower Bollinger Band** (mean reversion)" : ""}
${indicators.includes("Volume") ? "- Volume is **above 20-period average** (confirmation)" : ""}
${indicators.includes("VWAP") ? "- Price is **above VWAP** (intraday bias is bullish)" : ""}

**Exit Rules**
- Signal reverses (opposite condition fires)
- Stop-loss hit: ${risk.stopLoss}
- Take-profit hit: ${risk.takeProfit}
- End of session (for day/scalp styles)

**How Signals Update**
Signals are recalculated on every new closed candle. No look-ahead bias — signals only use data available at candle close.`,
      code: buildPseudocode(indicators, form.style),
      language: "python",
    },
    {
      id: "risk",
      title: "🛡️ Risk Management",
      icon: "🛡️",
      content: `**Risk Parameters (${riskLabel[form.riskLevel] || "Medium"} Risk)**

| Rule | Value |
|---|---|
| **Risk per Trade** | ${risk.posSize} |
| **Stop-Loss** | ${risk.stopLoss} |
| **Take-Profit** | ${risk.takeProfit} |
| **Risk/Reward Ratio** | ${risk.rr} |
| **Max Daily Loss** | ${risk.maxDaily} |
| **Max Open Positions** | ${form.riskLevel === "high" ? "3–5" : form.riskLevel === "low" ? "1–2" : "2–3"} |

**Safety Rules**
1. 🚨 **Kill switch** — halt all trading if daily loss exceeds max limit
2. ✅ **Never risk more than 2–3% per trade** — protects from ruin
3. 🔁 **No revenge trading** — skip next signal if 2 consecutive losses
4. 🔒 **API keys** in \`.env\` only — never hardcode or commit to GitHub
5. 📋 **Paper trade first** — validate for at least 30 days before going live`,
      code: `def calculate_position_size(capital: float,
                              risk_pct: float,
                              entry:   float,
                              stop:    float) -> float:
    """
    Kelly-inspired fixed-fraction position sizing.
    
    capital   — total account balance ($)
    risk_pct  — fraction of capital to risk (e.g. 0.02 = 2%)
    entry     — planned entry price
    stop      — stop-loss price
    returns   — number of units/shares to buy
    """
    risk_amount  = capital * risk_pct
    price_risk   = abs(entry - stop)          # $ risk per unit
    if price_risk == 0:
        return 0
    size = risk_amount / price_risk
    return round(size, 6)

# ── Kill Switch ──────────────────────────────────────────
def check_daily_loss(starting_capital: float,
                     current_capital:  float,
                     max_loss_pct:     float = 0.04) -> bool:
    """Returns True if daily loss limit breached → halt trading."""
    loss_pct = (starting_capital - current_capital) / starting_capital
    if loss_pct >= max_loss_pct:
        print(f"[KILL SWITCH] Daily loss {loss_pct:.1%} exceeded limit!")
        return True
    return False

# ── Example ──────────────────────────────────────────────
# size = calculate_position_size(10000, 0.02, entry=150.00, stop=147.50)
# print(f"Buy {size} shares")  →  Buy 80.0 shares`,
      language: "python",
    },
    {
      id: "execution",
      title: "⚡ Execution",
      icon: "⚡",
      content: `**Order Flow**
1. Strategy signal fires on candle close
2. Position size calculated via risk engine
3. Market order submitted via broker API
4. Stop-loss + take-profit set as bracket order
5. Order confirmation logged + Telegram alert sent
6. Next candle loop continues monitoring

**Slippage & Error Handling**
- Use **market orders** for liquid instruments, **limit orders** for low-liquidity
- Add retry logic (max 3 attempts, exponential backoff)
- Log every order with timestamp, size, price, and status
- Check account balance before each order`,
      code: buildExecutionCode(market),
      language: "python",
    },
    {
      id: "backtest",
      title: "🔬 Backtesting",
      icon: "🔬",
      content: `**How to Backtest**
1. Fetch historical OHLCV (minimum 1–2 years recommended)
2. Run \`generate_signal(df)\` over the full history
3. Simulate entry/exit without look-ahead bias
4. Calculate performance metrics

**Key Metrics to Target**
| Metric | Minimum Target | Good | Excellent |
|---|---|---|---|
| **Win Rate** | >45% | >55% | >65% |
| **Sharpe Ratio** | >0.5 | >1.0 | >2.0 |
| **Max Drawdown** | <30% | <20% | <10% |
| **Profit Factor** | >1.2 | >1.5 | >2.0 |
| **Total Return** | Positive | >20%/yr | >50%/yr |

**Optimisation Tips**
- Walk-forward testing (train on past, test on future periods)
- Avoid over-fitting — test with multiple parameter sets
- Use out-of-sample data to validate results`,
      code: buildBacktestCode(indicators),
      language: "python",
    },
    {
      id: "deployment",
      title: "🚀 Deployment",
      icon: "🚀",
      content: `**Hosting Options**
| Option | Cost | Best For |
|---|---|---|
| **Local PC** | Free | Testing & development |
| **GitHub Actions** | Free (2000 min/mo) | Scheduled strategies |
| **AWS EC2 t3.micro** | ~$8/mo | 24/7 algo trading |
| **DigitalOcean Droplet** | $6/mo | Lightweight VPS |
| **Heroku / Railway** | Free–$5/mo | Beginner-friendly PaaS |
| **Google Cloud Run** | Pay-per-use | Serverless execution |

**GitHub Free Hosting (No Domain Needed)**
- Host your dashboard at: \`https://yourusername.github.io/tradeforge\`
- Use GitHub Actions to run scheduled strategy checks
- Store logs as GitHub artifacts (free)
- Secrets stored in GitHub Secrets (encrypted)

**Alerts & Monitoring**
- 📱 Telegram Bot — instant push notifications (free)
- 📧 Gmail SMTP — email alerts (free)
- 📊 GitHub Actions summary — trade log per run`,
      code: buildDeployCode(),
      language: "python",
    },
    {
      id: "improvements",
      title: "💡 Improvements & Upgrades",
      icon: "💡",
      content: `**Easy Customisations**
- Change EMA periods (e.g., 9/21 → 20/50) to tune sensitivity
- Add a **volume filter** — only trade when volume > 1.5× average
- Add a **market regime filter** — only long above 200 SMA, only short below
- Test on multiple assets simultaneously (portfolio approach)
- Add trailing stop-loss to lock in profits

**Smart Upgrade #1 — ML Signal Filter**
Train a simple Random Forest or XGBoost model on your indicator values as features and trade outcome (1/0) as label. Use it as a probability gate: only execute trades when model confidence > 65%.

**Smart Upgrade #2 — Sentiment Layer**
Fetch news headlines via NewsAPI or Reddit (PRAW) and run basic sentiment scoring. Combine with technical signals for a multi-layer confirmation system — reduces false signals by ~20–30% in trending markets.`,
      code: `# ── Upgrade #1: ML Signal Filter ─────────────────────────
from sklearn.ensemble import RandomForestClassifier
import numpy as np

def train_signal_filter(df: pd.DataFrame, signals: pd.Series):
    """Train an ML model to filter high-confidence signals."""
    feature_cols = [c for c in df.columns
                    if c in ["rsi","macd","ema_fast","ema_slow","atr","volume"]]
    X = df[feature_cols].dropna()
    y = (signals.reindex(X.index) == 1).astype(int)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X[:-100], y[:-100])          # train on all but last 100 bars
    proba = model.predict_proba(X[-100:])[:, 1]   # probability of BUY
    return model, proba

# ── Upgrade #2: Sentiment Scoring ────────────────────────
import requests

def get_fear_greed_index() -> int:
    """CNN Fear & Greed Index (0=extreme fear, 100=extreme greed)."""
    r = requests.get("https://api.alternative.me/fng/").json()
    return int(r["data"][0]["value"])

# Only go long when market is fearful (contrarian) or in greed for trend
# score = get_fear_greed_index()
# if score < 30: print("Extreme Fear → potential BUY zone")`,
      language: "python",
    },
    {
      id: "disclaimer",
      title: "⚠️ Disclaimer",
      icon: "⚠️",
      content: `**IMPORTANT — Please Read**

This system was generated by **TradeForge AI** for **educational and informational purposes only**.

- ❌ This is **NOT financial advice**
- ❌ Past performance does **not** guarantee future results
- ❌ Automated trading carries **significant financial risk**
- ❌ You could **lose your entire capital**

**Before using real money:**
✅ Paper trade for a minimum of 30–60 days
✅ Consult a licensed financial advisor
✅ Only invest what you can afford to lose
✅ Understand the tax implications in your country
✅ Read your broker's terms and conditions

*TradeForge AI is not liable for any financial losses resulting from the use of this generated system.*`,
    },
  ];

  return {
    idea: form.idea,
    generatedAt: new Date().toLocaleString(),
    sections,
  };
}
