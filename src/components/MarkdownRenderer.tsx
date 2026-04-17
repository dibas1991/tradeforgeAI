

interface Props {
  content: string;
}

export default function MarkdownRenderer({ content }: Props) {
  const lines = content.split("\n");

  const renderLine = (line: string, idx: number) => {
    // Bold text: **text**
    const renderInline = (text: string) => {
      const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i} className="italic text-slate-300">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i} className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
        }
        return <span key={i}>{part}</span>;
      });
    };

    // Table row
    if (line.startsWith("|")) {
      return null; // handled separately
    }

    // H2/H3 headers
    if (line.startsWith("### ")) {
      return <h3 key={idx} className="text-base font-semibold text-white mt-4 mb-1">{line.slice(4)}</h3>;
    }
    if (line.startsWith("## ")) {
      return <h2 key={idx} className="text-lg font-bold text-white mt-5 mb-2">{line.slice(3)}</h2>;
    }
    if (line.startsWith("# ")) {
      return <h1 key={idx} className="text-xl font-bold text-white mt-5 mb-2">{line.slice(2)}</h1>;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const text = line.replace(/^\d+\.\s/, "");
      return (
        <li key={idx} className="ml-4 list-decimal text-slate-300 my-0.5">
          {renderInline(text)}
        </li>
      );
    }

    // Bullet list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const text = line.slice(2);
      return (
        <li key={idx} className="ml-4 list-none flex gap-2 text-slate-300 my-0.5">
          <span className="text-emerald-400 mt-0.5">›</span>
          <span>{renderInline(text)}</span>
        </li>
      );
    }

    // Empty line
    if (line.trim() === "") {
      return <div key={idx} className="h-2" />;
    }

    return (
      <p key={idx} className="text-slate-300 leading-relaxed">
        {renderInline(line)}
      </p>
    );
  };

  // Parse tables
  const renderContent = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      // Detect table
      if (line.startsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].startsWith("|")) {
          tableLines.push(lines[i]);
          i++;
        }

        const rows = tableLines.filter((l) => !l.match(/^\|\s*[-:]+\s*\|/));
        if (rows.length > 0) {
          const headers = rows[0].split("|").filter((c) => c.trim() !== "").map((c) => c.trim());
          const dataRows = rows.slice(1);

          result.push(
            <div key={`table-${i}`} className="overflow-x-auto my-3">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700">
                    {headers.map((h, hi) => (
                      <th key={hi} className="px-3 py-2 text-xs font-semibold text-emerald-400 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, ri) => {
                    const cells = row.split("|").filter((c) => c.trim() !== "").map((c) => c.trim());
                    return (
                      <tr key={ri} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                        {cells.map((cell, ci) => (
                          <td key={ci} className="px-3 py-2 text-slate-300 whitespace-nowrap">
                            {cell.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((p, pi) => {
                              if (p.startsWith("**") && p.endsWith("**")) return <strong key={pi} className="font-semibold text-white">{p.slice(2, -2)}</strong>;
                              if (p.startsWith("`") && p.endsWith("`")) return <code key={pi} className="bg-slate-800 text-emerald-400 px-1 rounded text-xs font-mono">{p.slice(1, -1)}</code>;
                              return <span key={pi}>{p}</span>;
                            })}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      const el = renderLine(line, i);
      if (el) result.push(el);
      i++;
    }
    return result;
  };

  return <div className="space-y-1">{renderContent()}</div>;
}
