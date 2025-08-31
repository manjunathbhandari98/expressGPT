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
      <div className="flex my-4 items-end justify-end w-full">
        <div className="flex items-end gap-2 max-w-[70%]">
          <div className="bg-white/10 text-white text-lg p-3 rounded-l-xl rounded-t-xl flex flex-col relative whitespace-pre-wrap break-words min-w-0">
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
                    fontSize: "15px",
                    lineHeight: "24px",
                    maxHeight: "240px",
                    minHeight: "48px",
                  }}
                />
                <div className="flex gap-2 mt-3 justify-end">
                  <button
                    onClick={handleEditCancel}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/70 hover:text-white"
                    title="Cancel edit"
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={handleEditSave}
                    disabled={!editText.trim() || editText.trim() === message}
                    className={`p-1.5 rounded-lg transition-colors ${
                      editText.trim() && editText.trim() !== message
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-600/30 text-white/50 cursor-not-allowed"
                    }`}
                    title="Save changes"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <span>{message}</span>
            )}
          </div>
        </div>
      </div>
      
      {!isEditing && (
        <div className="flex justify-end">
          <div className="flex gap-5">
            <button
              onClick={handleEditStart}
              disabled={isStreaming}
              className={`flex items-center cursor-pointer rounded-xl transition-colors touch-manipulation ${
                isStreaming
                  ? "text-white/30 cursor-not-allowed"
                  : "text-white hover:text-white/80"
              }`}
              title={isStreaming ? "Cannot edit while streaming" : "Edit"}
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center cursor-pointer rounded-xl transition-colors touch-manipulation text-white hover:text-white/80"
              title="Copy"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestBubble;