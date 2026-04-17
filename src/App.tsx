import { useState } from "react";
import { FormState, TradingSystem } from "./types";
import { generateTradingSystem } from "./engine/generator";
import Header from "./components/Header";
import IdeaForm from "./components/IdeaForm";
import ResultPanel from "./components/ResultPanel";

const DEFAULT_FORM: FormState = {
  idea: "",
  market: "crypto",
  country: "United States",
  style: "swing",
  riskLevel: "medium",
  capital: "$10,000",
};

export default function App() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [system, setSystem] = useState<TradingSystem | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    // Simulate brief processing time for UX feel
    setTimeout(() => {
      const result = generateTradingSystem(form);
      setSystem(result);
      setLoading(false);
      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 1200);
  };

  const handleReset = () => {
    setSystem(null);
    setForm(DEFAULT_FORM);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#060b14] to-transparent" />
      </div>

      <div className="relative">
        <Header />

        <main className="max-w-4xl mx-auto px-4 pb-24">
          {/* Form card */}
          {!system && (
            <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-2xl shadow-black/40">
              <div className="mb-6">
                <h2 className="text-white font-bold text-lg mb-1">⚙️ Configure Your Strategy</h2>
                <p className="text-slate-400 text-sm">Fill in the details below and TradeForge AI will generate a complete, ready-to-run trading system.</p>
              </div>
              <IdeaForm
                form={form}
                onChange={setForm}
                onSubmit={handleGenerate}
                loading={loading}
              />
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-pulse">
                  <span className="text-3xl">🤖</span>
                </div>
                <div className="absolute -inset-2 rounded-2xl border-2 border-emerald-500/30 animate-ping" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-xl mb-2">Forging your trading system…</h3>
                <p className="text-slate-400 text-sm">Analysing indicators, building code, calculating risk parameters</p>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {system && !loading && (
            <div id="results">
              <ResultPanel system={system} onReset={handleReset} />
            </div>
          )}

          {/* How it works — shown on home */}
          {!system && !loading && (
            <div className="mt-16">
              <h2 className="text-center text-white font-bold text-xl mb-8">
                How <span className="text-emerald-400">TradeForge AI</span> Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    step: "01",
                    icon: "💡",
                    title: "Describe Your Idea",
                    desc: "Type any trading idea — mention indicators, markets, or strategies you've heard about. No coding needed.",
                  },
                  {
                    step: "02",
                    icon: "🤖",
                    title: "AI Builds the System",
                    desc: "TradeForge analyses your idea and generates a complete system with Python code, risk rules, and backtesting logic.",
                  },
                  {
                    step: "03",
                    icon: "🚀",
                    title: "Deploy & Trade",
                    desc: "Copy the code, set up your broker API, paper trade first, then go live. Export as Markdown for GitHub.",
                  },
                ].map((item) => (
                  <div key={item.step} className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-3 right-4 text-slate-700/40 font-black text-4xl leading-none">{item.step}</div>
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="text-white font-bold text-sm mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Supported markets */}
              <div className="mt-10 bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6">
                <h3 className="text-white font-bold text-sm mb-4 text-center">Supported Markets & Strategies</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                    { icon: "🪙", label: "Crypto" },
                    { icon: "📈", label: "Stocks" },
                    { icon: "💱", label: "Forex" },
                    { icon: "📦", label: "Futures" },
                    { icon: "🎯", label: "Options" },
                    { icon: "⚡", label: "Scalping" },
                    { icon: "☀️", label: "Day Trade" },
                    { icon: "🌊", label: "Swing" },
                    { icon: "🏔️", label: "Position" },
                    { icon: "🤖", label: "Algo / Quant" },
                  ].map((m) => (
                    <div key={m.label} className="flex flex-col items-center gap-1.5 bg-slate-800/40 rounded-xl py-3 px-2">
                      <span className="text-2xl">{m.icon}</span>
                      <span className="text-slate-400 text-xs font-medium">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer mini */}
              <p className="mt-8 text-center text-slate-600 text-xs">
                ⚠️ TradeForge AI is for <strong className="text-slate-500">educational purposes only</strong>. 
                Always paper trade first. Trading involves significant financial risk.
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/60 py-8 px-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <span className="text-white font-bold">TradeForge AI</span>
              <span className="text-slate-600 text-sm">— Educational tool only</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-xs">
              <span>Free to use • No account needed</span>
              <span>•</span>
              <span>🐙 GitHub Pages ready</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
