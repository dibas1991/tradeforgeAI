import { useState } from "react";
import { TradingSystemSection } from "../types";
import CodeBlock from "./CodeBlock";
import MarkdownRenderer from "./MarkdownRenderer";

interface Props {
  section: TradingSystemSection;
  index: number;
}

export default function SectionCard({ section, index }: Props) {
  const [open, setOpen] = useState(index < 2);

  const isDisclaimer = section.id === "disclaimer";

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        isDisclaimer
          ? "border-amber-500/40 bg-amber-950/20"
          : "border-slate-700/60 bg-slate-900/60"
      } backdrop-blur-sm overflow-hidden`}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <h2 className={`font-bold text-base md:text-lg ${isDisclaimer ? "text-amber-400" : "text-white"}`}>
            {section.title}
          </h2>
        </div>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
          open ? "bg-emerald-500/20 rotate-180" : "bg-slate-700/60"
        }`}>
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="px-5 pb-5 border-t border-slate-700/40 pt-4">
          <MarkdownRenderer content={section.content} />
          {section.code && (
            <CodeBlock code={section.code} language={section.language} />
          )}
        </div>
      )}
    </div>
  );
}
