export default function Header() {
  return (
    <header className="relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-16 right-0 w-80 h-80 bg-teal-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-20 left-1/2 w-64 h-64 bg-cyan-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-xs font-semibold tracking-wide uppercase">AI-Powered Strategy Builder</span>
        </div>

        {/* Logo & Title */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
              Trade<span className="text-emerald-400">Forge</span>
              <span className="ml-2 text-2xl md:text-3xl">AI</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-0.5">Turn any trading idea into a system</p>
          </div>
        </div>

        <p className="max-w-2xl mx-auto text-slate-400 text-base md:text-lg leading-relaxed mt-4">
          Describe your strategy, choose your market and style — get a complete
          <span className="text-emerald-400 font-medium"> step-by-step trading system</span> with
          Python code, risk management, backtesting, and deployment guide. All free. No domain needed.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {[
            "📋 Strategy Blueprint",
            "🐍 Python Code",
            "🛡️ Risk Rules",
            "🔬 Backtesting",
            "🚀 GitHub Deploy",
            "📱 Telegram Alerts",
          ].map((f) => (
            <span key={f} className="bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs px-3 py-1 rounded-full font-medium">
              {f}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
