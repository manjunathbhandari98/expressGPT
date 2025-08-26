/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "highlight.js/styles/github-dark.css"; // highlight.js theme
import { ArrowDownToLine, Bot, Copy } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

type ResponseBubbleProps = {
  message: string;
  timestamp?: string;
  isStreaming?: boolean;
};

const extForLang = (lang: string) => {
  const map: Record<string,string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    jsx: "jsx",
    tsx: "tsx",
    css: "css",
    html: "html",
    json: "json",
  };
  return map[lang.toLowerCase()] || "txt";
};

const ResponseBubble = ({ message, timestamp, isStreaming = false }: ResponseBubbleProps) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleDownload = (code: string, language: string) => {
    const ext = extForLang(language);
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-start gap-3 w-full text-lg">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 mt-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
        <Bot size={14} className="text-white" />
      </div>

      <div className="flex-1 min-w-0">
        {/* Message card */}
        <div className="rounded-2xl rounded-tl-sm p-4 bg-transparent">
          <div className="max-w-none text-white">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // custom code renderer (handles inline + block)
                code({ inline, className, children, ...props }: any) {
                  const raw = String(children);
                  const codeString = raw.replace(/\n$/, "");
                  // className typically like "language-jsx"
                  const hasLang = typeof className === "string" && className.startsWith("language-");
                  const langMatch = hasLang ? /language-(\w+)/.exec(className) : null;
                  const lang = langMatch ? langMatch[1] : "code";

                  // Inline code -> small pill
                  if (inline || !hasLang) {
                    return (
                       <div className="w-full my-6 rounded-lg bg-[#0d1117] border border-gray-700 overflow-hidden">
      {/* top bar (language + copy + download) */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#161b22] border-b border-gray-700">
        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
          {lang || "CODE"}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(codeString)}
            className="p-2 rounded bg-black/40 hover:bg-black/60 text-xs text-white transition"
             title="Copy code"
          >
            {copiedCode === codeString ? "Copied!" : <div className="items-center flex gap-1"><Copy size={14} />
            Copy</div>  }
          </button>

          <button
            onClick={() => {
              const blob = new Blob([codeString], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${lang || "code"}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="p-2 flex gap-1 items-center rounded bg-black/40 hover:bg-black/60 text-xs text-white transition"
            title="Download code"
          >
            <ArrowDownToLine size={14}/> Download
          </button>
        </div>
      </div>
                       <pre className="w-full p-5 overflow-x-auto bg-[#0d1117] text-md font-mono text-white">
  <code>{children}</code>
</pre>

                      </div>
                      
                    );
                  }

                  // BLOCK code -> full black container with header + actions
                 
                },
              }}
            >
              {message}
            </ReactMarkdown>
          </div>

          {/* streaming indicator or timestamp can go here */}
          {isStreaming && (
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
              </div>
              <span>AI is typing...</span>
            </div>
          )}
        </div>

        {timestamp && <div className="text-xs text-gray-400 mt-2 ml-1">{timestamp}</div>}
      </div>
    </div>
  );
};

export default ResponseBubble;
