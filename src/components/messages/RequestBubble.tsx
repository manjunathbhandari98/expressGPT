import { Check, Copy, Pencil, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type RequestBubbleProps = {
  message: string;
  messageId: number;
  isStreaming: boolean;
  onEditRequest: (messageId: number, newText: string) => void;
};

const RequestBubble = ({ message, messageId, isStreaming, onEditRequest }: RequestBubbleProps) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea and focus when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
      
      // Auto-resize logic
      textareaRef.current.style.height = "auto";
      const lineHeight = 24;
      const maxRows = 10;
      const maxHeight = lineHeight * maxRows;
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        maxHeight
      ) + "px";
    }
  }, [isEditing]);

  // Auto-resize on text change
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const lineHeight = 24;
      const maxRows = 10;
      const maxHeight = lineHeight * maxRows;
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        maxHeight
      ) + "px";
    }
  }, [editText, isEditing]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleEditStart = () => {
    if (!isStreaming) {
      setIsEditing(true);
      setEditText(message);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditText(message);
  };

  const handleEditSave = () => {
    if (editText.trim() && editText.trim() !== message) {
      onEditRequest(messageId, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    }
    if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex my-2 sm:my-4 items-end justify-end w-full">
        <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%] lg:max-w-[70%]">
          <div className="bg-white/10 text-white text-sm sm:text-base lg:text-lg p-3 sm:p-4 rounded-l-xl rounded-t-xl flex flex-col relative whitespace-pre-wrap break-words min-w-0 shadow-lg backdrop-blur-sm border border-white/20">
            {isEditing ? (
              <div className="w-full">
                <textarea
                  ref={textareaRef}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-white placeholder:text-white/50 outline-none border-none resize-none overflow-y-auto custom-scrollbar"
                  placeholder="Edit your message..."
                  rows={2}
                  style={{
                    fontSize: "16px", // Prevents zoom on iOS
                    lineHeight: "24px",
                    maxHeight: "240px",
                    minHeight: "48px",
                  }}
                />
                <div className="flex gap-2 mt-3 justify-end">
                  <button
                    onClick={handleEditCancel}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors text-white/70 hover:text-white touch-manipulation"
                    title="Cancel edit"
                    aria-label="Cancel edit"
                  >
                    <X size={14} />
                  </button>
                  <button
                    onClick={handleEditSave}
                    disabled={!editText.trim() || editText.trim() === message}
                    className={`p-2 rounded-lg transition-colors touch-manipulation ${
                      editText.trim() && editText.trim() !== message
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-600/30 text-white/50 cursor-not-allowed"
                    }`}
                    title="Save changes"
                    aria-label="Save changes"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <span className="leading-relaxed">{message}</span>
            )}
          </div>
        </div>
      </div>
      
      {!isEditing && (
        <div className="flex justify-end">
          <div className="flex gap-3 sm:gap-4 lg:gap-5">
            <button
              onClick={handleEditStart}
              disabled={isStreaming}
              className={`flex items-center justify-center p-2 rounded-xl transition-colors touch-manipulation min-h-[44px] min-w-[44px] ${
                isStreaming
                  ? "text-white/30 cursor-not-allowed"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              title={isStreaming ? "Cannot edit while streaming" : "Edit"}
              aria-label={isStreaming ? "Cannot edit while streaming" : "Edit"}
            >
              <Pencil size={14}  />
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center p-2 rounded-xl transition-colors touch-manipulation text-white/70 hover:text-white hover:bg-white/10 min-h-[44px] min-w-[44px]"
              title="Copy"
              aria-label="Copy message"
            >
              {copied ? <Check size={14}  /> : <Copy size={14}  />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestBubble;