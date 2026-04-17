import { FormState } from "../types";

interface Props {
  form: FormState;
  onChange: (form: FormState) => void;
  onSubmit: () => void;
  loading: boolean;
}

const MARKET_OPTIONS = [
  { value: "crypto", label: "🪙 Cryptocurrency" },
  { value: "stocks", label: "📈 Stocks / Equities" },
  { value: "forex", label: "💱 Forex" },
  { value: "futures", label: "📦 Futures / Commodities" },
  { value: "options", label: "🎯 Options" },
];

const STYLE_OPTIONS = [
  { value: "scalping", label: "⚡ Scalping (seconds–minutes)" },
  { value: "day", label: "☀️ Day Trading (intraday)" },
  { value: "swing", label: "🌊 Swing Trading (days–weeks)" },
  { value: "position", label: "🏔️ Position Trading (weeks–months)" },
  { value: "algo", label: "🤖 Algorithmic / Quantitative" },
];

const RISK_OPTIONS = [
  { value: "low", label: "🟢 Low (conservative, 1% per trade)" },
  { value: "medium", label: "🟡 Medium (balanced, 2% per trade)" },
  { value: "high", label: "🔴 High (aggressive, 3% per trade)" },
];

const COUNTRY_OPTIONS = [
  "United States", "United Kingdom", "India", "European Union",
  "Australia", "Canada", "Singapore", "UAE", "Other / Global",
];

const EXAMPLES = [
  "RSI oversold bounce with EMA trend filter on BTC/USDT",
  "MACD crossover + volume spike on S&P 500 futures",
  "Bollinger Band squeeze breakout on EUR/USD forex",
  "EMA 9/21 crossover with Supertrend confirmation on NIFTY",
  "Stochastic + VWAP reversal strategy for day trading AAPL",
];

export default function IdeaForm({ form, onChange, onSubmit, loading }: Props) {
  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange({ ...form, [field]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.idea.trim().length < 5) return;
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Idea */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          💡 Your Trading Idea <span className="text-emerald-400">*</span>
        </label>
        <textarea
          value={form.idea}
          onChange={set("idea")}
          rows={3}
          placeholder="Describe your trading idea… e.g. RSI oversold bounce with EMA trend filter on BTC/USDT"
          className="w-full bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 resize-none transition-all"
          required
        />
        {/* Examples */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => onChange({ ...form, idea: ex })}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 border border-slate-700 rounded-lg px-2.5 py-1 transition-colors"
            >
              {ex.length > 38 ? ex.slice(0, 38) + "…" : ex}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Market + Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">📍 Market</label>
          <select
            value={form.market}
            onChange={set("market")}
            className="w-full bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
          >
            {MARKET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">🎯 Trading Style</label>
          <select
            value={form.style}
            onChange={set("style")}
            className="w-full bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
          >
            {STYLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Country + Capital */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">🌍 Your Country</label>
          <select
            value={form.country}
            onChange={set("country")}
            className="w-full bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">💰 Starting Capital</label>
          <input
            type="text"
            value={form.capital}
            onChange={set("capital")}
            placeholder="e.g. $10,000"
            className="w-full bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Risk Level */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">⚖️ Risk Level</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {RISK_OPTIONS.map((o) => (
            <label
              key={o.value}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                form.riskLevel === o.value
                  ? "border-emerald-500 bg-emerald-500/10 text-white"
                  : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-500"
              }`}
            >
              <input
                type="radio"
                name="risk"
                value={o.value}
                checked={form.riskLevel === o.value}
                onChange={set("riskLevel")}
                className="sr-only"
              />
              <span className="text-sm font-medium">{o.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || form.idea.trim().length < 5}
        className="w-full py-4 px-6 rounded-xl font-bold text-base bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5"
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating your trading system…
          </>
        ) : (
          <>
            <span>🚀</span>
            Generate Trading System
          </>
        )}
      </button>
    </form>
  );
}
