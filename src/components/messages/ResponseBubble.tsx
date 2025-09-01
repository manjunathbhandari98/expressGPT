import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { ArrowDownToLine, Copy } from "lucide-react";
import React, { useState } from "react";
import ExpressGPTLogo from "../logo/ExpressGPTLogo";
import Thinking from "../Thinking";

type ResponseBubbleProps = {
  message: string;
  timestamp?: string;
  isStreaming?: boolean;
};

const extForLang = (lang: string) => {
  const map: Record<string, string> = {
    javascript: "Javascript",
    typescript: "Typescript",
    python: "Python",
    jsx: "jsx",
    tsx: "tsx",
    css: "CSS",
    html: "HTML",
    json: "JSON",
    java: "Java",
    cpp: "CPP",
    c: "C",
    go: "GO",
    rust: "RS",
    php: "php",
    ruby: "RB",
    swift: "SWIFT",
    kotlin: "KT",
    dart: "DART",
    sql: "SQL",
    shell: "SH",
    bash: "BASH",
    yaml: "YAML",
    xml: "XML",
  };
  return map[lang.toLowerCase()] || "Code";
};

// Enhanced markdown parser with better responsive formatting
const parseMarkdown = (content: string): React.ReactNode[] => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text';
      const codeLines: string[] = [];
      i++;
      
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }

      elements.push(
        <CodeBlock key={i} language={language}>
          {codeLines.join('\n')}
        </CodeBlock>
      );
      i++;
      continue;
    }

    // Headings - responsive sizing
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 1;
      const text = line.replace(/^#+\s*/, '');
      
      if (level === 1) {
        elements.push(
          <h1 key={i} className="text-xl sm:text-2xl lg:text-3xl font-bold mt-4 sm:mt-6 mb-3 sm:mb-4 text-white leading-tight">
            {parseInlineMarkdown(text)}
          </h1>
        );
      } else if (level === 2) {
        elements.push(
          <h2 key={i} className="text-lg sm:text-xl lg:text-2xl font-semibold mt-4 sm:mt-5 mb-2 sm:mb-3 text-white leading-tight">
            {parseInlineMarkdown(text)}
          </h2>
        );
      } else if (level === 3) {
        elements.push(
          <h3 key={i} className="text-base sm:text-lg lg:text-xl font-medium mt-3 sm:mt-4 mb-2 sm:mb-3 text-white leading-tight">
            {parseInlineMarkdown(text)}
          </h3>
        );
      } else {
        elements.push(
          <h4 key={i} className="text-sm sm:text-base lg:text-lg font-medium mt-3 sm:mt-4 mb-2 text-white leading-tight">
            {parseInlineMarkdown(text)}
          </h4>
        );
      }
    }
    // Blockquotes - responsive padding
    else if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && (lines[i].startsWith('>') || lines[i].trim() === '')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      i--;
      
      elements.push(
        <blockquote key={i} className="border-l-2 sm:border-l-4 border-blue-500 pl-3 sm:pl-4 my-3 sm:my-4 italic text-gray-300 bg-gray-800/30 py-2 sm:py-3 rounded-r-lg">
          <div className="space-y-1 sm:space-y-2">
            {quoteLines.filter(line => line.trim()).map((quoteLine, idx) => (
              <p key={idx} className="leading-relaxed text-sm sm:text-base">
                {parseInlineMarkdown(quoteLine)}
              </p>
            ))}
          </div>
        </blockquote>
      );
    }
    // Unordered lists - responsive spacing
    else if (line.match(/^[-*+]\s/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*+]\s/)) {
        listItems.push(lines[i].replace(/^[-*+]\s/, ''));
        i++;
      }
      i--;
      
      elements.push(
        <ul key={i} className="list-disc pl-4 sm:pl-6 mb-3 sm:mb-4 mt-2 space-y-1 sm:space-y-2 text-gray-200">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed text-sm sm:text-base">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
    }
    // Ordered lists - responsive spacing
    else if (line.match(/^\d+\.\s/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      i--;
      
      elements.push(
        <ol key={i} className="list-decimal pl-4 sm:pl-6 mb-3 sm:mb-4 mt-2 space-y-1 sm:space-y-2 text-gray-200">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed text-sm sm:text-base">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
    }
    // Tables - responsive with horizontal scroll
    else if (line.includes('|') && lines[i + 1]?.includes('|') && lines[i + 1].includes('-')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      i--;

      const [headerLine, , ...rowLines] = tableLines;
      const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);
      const rows = rowLines.map(row => 
        row.split('|').map(cell => cell.trim()).filter(cell => cell)
      );

      elements.push(
        <div key={i} className="overflow-x-auto my-4 sm:my-6 border border-gray-700 rounded-lg">
          <table className="w-full border-collapse text-gray-200 min-w-full">
            <thead>
              <tr>
                {headers.map((header, idx) => (
                  <th key={idx} className="border border-gray-700 bg-gray-800 px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-xs sm:text-sm lg:text-base whitespace-nowrap">
                    {parseInlineMarkdown(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="border border-gray-700 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm lg:text-base">
                      {parseInlineMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    // Empty lines - responsive spacing
    else if (line.trim() === '') {
      elements.push(<div key={`spacer-${i}`} className="h-1 sm:h-2"></div>);
    }
    // Regular paragraphs - responsive text
    else if (line.trim()) {
      elements.push(
        <p key={`line-${i}`} className="mb-2 sm:mb-3 leading-relaxed text-sm sm:text-base text-gray-200">
          {parseInlineMarkdown(line.trim())}
        </p>
      );
    }
    
    i++;
  }
  
  return elements;
};

const parseInlineMarkdown = (text: string): React.ReactNode => {
  const parts: (string | React.ReactNode)[] = [text];
  
  // Bold (**text** or __text__)
  for (let i = 0; i < parts.length; i++) {
    if (typeof parts[i] === 'string') {
      const str = parts[i] as string;
      const boldRegex = /(\*\*|__)(.*?)\1/g;
      
      if (boldRegex.test(str)) {
        const newParts: (string | React.ReactNode)[] = [];
        let lastIndex = 0;
        let match;
        boldRegex.lastIndex = 0;
        
        while ((match = boldRegex.exec(str)) !== null) {
          if (match.index > lastIndex) {
            newParts.push(str.slice(lastIndex, match.index));
          }
          newParts.push(
            <strong key={`bold-${match.index}`} className="text-white font-bold">
              {match[2]}
            </strong>
          );
          lastIndex = boldRegex.lastIndex;
        }
        
        if (lastIndex < str.length) {
          newParts.push(str.slice(lastIndex));
        }
        
        parts.splice(i, 1, ...newParts);
        i += newParts.length - 1;
      }
    }
  }
  
  // Italic (*text* but not **text**)
  for (let i = 0; i < parts.length; i++) {
    if (typeof parts[i] === 'string') {
      const str = parts[i] as string;
      const italicRegex = /(?<!\*)\*(?!\*)([^*\n]+)\*(?!\*)/g;
      
      if (italicRegex.test(str)) {
        const newParts: (string | React.ReactNode)[] = [];
        let lastIndex = 0;
        let match;
        italicRegex.lastIndex = 0;
        
        while ((match = italicRegex.exec(str)) !== null) {
          if (match.index > lastIndex) {
            newParts.push(str.slice(lastIndex, match.index));
          }
          newParts.push(
            <em key={`italic-${match.index}`} className="italic text-gray-100">
              {match[1]}
            </em>
          );
          lastIndex = italicRegex.lastIndex;
        }
        
        if (lastIndex < str.length) {
          newParts.push(str.slice(lastIndex));
        }
        
        parts.splice(i, 1, ...newParts);
        i += newParts.length - 1;
      }
    }
  }
  
  // Inline code (`code`) - responsive sizing
  for (let i = 0; i < parts.length; i++) {
    if (typeof parts[i] === 'string') {
      const str = parts[i] as string;
      const codeRegex = /`([^`\n]+)`/g;
      
      if (codeRegex.test(str)) {
        const newParts: (string | React.ReactNode)[] = [];
        let lastIndex = 0;
        let match;
        codeRegex.lastIndex = 0;
        
        while ((match = codeRegex.exec(str)) !== null) {
          if (match.index > lastIndex) {
            newParts.push(str.slice(lastIndex, match.index));
          }
          newParts.push(
            <code key={`code-${match.index}`} className="px-1 sm:px-1.5 py-0.5 mx-0.5 rounded bg-gray-800 text-pink-300 font-mono text-xs sm:text-sm border border-gray-700 whitespace-nowrap">
              {match[1]}
            </code>
          );
          lastIndex = codeRegex.lastIndex;
        }
        
        if (lastIndex < str.length) {
          newParts.push(str.slice(lastIndex));
        }
        
        parts.splice(i, 1, ...newParts);
        i += newParts.length - 1;
      }
    }
  }
  
  return parts.length === 1 ? parts[0] : <>{parts}</>;
};

const CodeBlock = ({ children, language }: { children: string; language: string }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const highlighted = React.useMemo(() => {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(children, { language }).value;
    }
    return hljs.highlightAuto(children).value;
  }, [children, language]);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDownload = (code: string, lang: string) => {
    const ext = extForLang(lang);
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${ext.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full my-4 sm:my-6 rounded-lg bg-[#0d1117] border border-gray-700 overflow-hidden">
      {/* Header - responsive padding */}
      <div className="flex items-center justify-between px-2 sm:px-3 py-2 bg-[#161b22] border-b border-gray-700">
        <div className="text-xs sm:text-sm text-gray-400 uppercase font-semibold">
          {extForLang(language) || "Code"}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => handleCopy(children.trim())}
            className="p-1.5 rounded bg-black/40 hover:bg-black/60 text-xs text-white transition-colors duration-200 touch-manipulation"
            title="Copy code"
            aria-label="Copy code"
          >
            {copiedCode === children.trim() ? (
              <span className="text-xs">Copied</span>
            ) : (
              <Copy size={12} />
            )}
          </button>
          <button
            onClick={() => handleDownload(children.trim(), language || "txt")}
            className="p-1.5 rounded bg-black/40 hover:bg-black/60 text-xs text-white transition-colors duration-200 touch-manipulation"
            title="Download code"
            aria-label="Download code"
          >
            <ArrowDownToLine size={12} />
          </button>
        </div>
      </div>

      {/* Code Body with syntax highlight - responsive padding and text */}
      <pre className="w-full p-3 sm:p-4 lg:p-5 overflow-x-auto bg-[#0d1117] text-xs sm:text-sm font-mono">
        <code
          className={`hljs language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
};

const ResponseBubble = ({
  message,
  timestamp,
  isStreaming = false,
}: ResponseBubbleProps) => {
  return (
    <div className="flex items-start gap-2 sm:gap-3 w-full">
      {/* Avatar - responsive sizing */}
      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 mt-1 rounded-full bg-transparent flex items-center justify-center">
        <ExpressGPTLogo size={16}  withText={false} />
      </div>
      
      <div className="flex-1 min-w-0">
        {/* Message card - responsive padding */}
        <div className="rounded-2xl rounded-tl-sm p-3 sm:p-4 lg:p-5 bg-transparent">
          <div className="max-w-none text-white prose prose-invert prose-sm sm:prose-base lg:prose-lg">
            {message ? parseMarkdown(message) : null}
          </div>
          {/* Streaming indicator */} 
          {isStreaming && <Thinking />}
        </div>
        {timestamp && (
          <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2 ml-2">{timestamp}</div>
        )}
      </div>
    </div>
  );
};

export default ResponseBubble;