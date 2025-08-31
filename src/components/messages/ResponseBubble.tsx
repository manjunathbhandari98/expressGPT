/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "highlight.js/styles/github-dark.css"; // highlight.js theme
import { ArrowDownToLine, Copy } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import ExpressGPTLogo from "../logo/ExpressGPTLogo";
import Thinking from "../Thinking";

type ResponseBubbleProps = {
  message: string;
  timestamp?: string;
  isStreaming?: boolean;
};

const extForLang = (lang: string) => {
  const map: Record<string, string> = {
    javascript: "JS",
    typescript: "TS",
    python: "PY",
    jsx: "JSX",
    tsx: "TSX",
    css: "CSS",
    html: "HTML",
    json: "JSON",
  };
  return map[lang.toLowerCase()] || "CODE";
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
      <div className="flex-shrink-0 w-8 h-8 mt-5 rounded-full bg-transparent flex items-center justify-center shadow-lg">
        <ExpressGPTLogo size={24} withText={false}/>
      </div>

      <div className="flex-1 min-w-0">
        {/* Message card */}
        <div className="rounded-2xl rounded-tl-sm p-4 bg-transparent">
          <div className="max-w-none text-white">
           <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
  components={{
    h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-2 text-white">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-semibold mt-3 mb-2 text-white">{children}</h2>,
    p: ({ children }) => <p className="mb-2 leading-relaxed text-gray-200">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-2 text-gray-200">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-2 text-gray-200">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    table: ({ children }) => (
      <div className="overflow-x-auto my-4 border border-gray-700 rounded-lg">
        <table className="w-full border-collapse text-gray-200">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-gray-700 bg-gray-800 px-3 py-1 text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-700 px-3 py-1">{children}</td>
    ),
    // 👇 your code block renderer (already styled)
    code({ inline, node, className, children }: any) {
      const raw =
        (node.position &&
          message.substring(node.position.start.offset, node.position.end.offset)) ||
        (Array.isArray(children) ? children.join("") : String(children));

      const codeString = raw.trim();

      const hasLang = typeof className === "string" && className.startsWith("language-");
      const langMatch = hasLang ? /language-(\w+)/.exec(className) : null;
      const lang = langMatch ? langMatch[1].toLowerCase() : "";

      // Inline code
      if (inline) {
        return (
          <code className="px-1.5 py-0.5 rounded bg-gray-800 text-pink-400 font-mono text-sm">
            {children}
          </code>
        );
      }

      // Block code
      return (
        <div className="w-full my-6 rounded-lg bg-[#0d1117] border border-gray-700 overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-3 py-1 bg-[#161b22] border-b border-gray-700">
           <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
  {extForLang(lang) || "CODE"}
</div>


            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(codeString)}
                className="p-1.5 rounded bg-black/40 hover:bg-black/60 text-xs text-white transition"
                title="Copy code"
              >
                {copiedCode === codeString ? "Copied" : <Copy size={14} />}
              </button>

              <button
                onClick={() => handleDownload(codeString, lang || "txt")}
                className="p-1.5 rounded bg-black/40 hover:bg-black/60 text-xs text-white transition"
                title="Download code"
              >
                <ArrowDownToLine size={14} />
              </button>
            </div>
          </div>

          {/* Code body */}
          <pre className="w-full p-5 overflow-x-auto bg-[#0d1117] text-md font-mono text-white">
            <code>{children}</code>
          </pre>
        </div>
      );
    },
  }}
>
  {message}
</ReactMarkdown>

          </div>

          {/* streaming indicator or timestamp can go here */}
          {isStreaming && <Thinking/>}
        </div>

        {timestamp && <div className="text-xs text-gray-400 mt-2 ml-1">{timestamp}</div>}
      </div>
    </div>
  );
};

export default ResponseBubble;
