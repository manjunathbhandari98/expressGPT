/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu, Mic, Paperclip, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { generateResponse } from "../services/geminiServices";
import type { Chat } from "../types/chat";
import type { Message } from "../types/message";
import RequestBubble from "./messages/RequestBubble";
import ResponseBubble from "./messages/ResponseBubble";

type ChatViewProps = {
  onToggleSidebar: () => void;
  currentChatId: string | null;
  chats: Chat[];
  onUpdateChats: (chats: Chat[]) => void;
  onCreateNewChat: () => void;
};

const ChatView: React.FC<ChatViewProps> = ({ 
  onToggleSidebar, 
  currentChatId, 
  chats, 
  onUpdateChats,
  onCreateNewChat 
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, currentChatId]);

  const currentChat = chats.find((c) => c.id === currentChatId);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // If no current chat, create a new one
    if (!currentChatId) {
      onCreateNewChat();
      return;
    }

    const newMessage: Message = {
      id: Date.now(),
      type: "request",
      text: input.trim(),
    };

    // Add user message
    const updatedChats = chats.map((c) =>
      c.id === currentChatId
        ? { ...c, messages: [...c.messages, newMessage] }
        : c
    );
    onUpdateChats(updatedChats);
    setInput("");

    // Add loading message
    const loadingId = Date.now() + 1;
    const chatsWithLoading = updatedChats.map((c) =>
      c.id === currentChatId
        ? { 
            ...c, 
            messages: [...c.messages, { 
              id: loadingId, 
              type: "response" as const, 
              text: "…" 
            }] 
          }
        : c
    );
    onUpdateChats(chatsWithLoading);

    try {
      const reply = await generateResponse(newMessage.text);
      const finalChats = chatsWithLoading.map((c) =>
        c.id === currentChatId
          ? {
              ...c,
              messages: c.messages.map((m: Message) =>
                m.id === loadingId ? { ...m, text: reply ?? "" } : m
              ),
              title:
                c.title === "New Chat"
                  ? newMessage.text.slice(0, 20)
                  : c.title, // auto-generate chat title
            }
          : c
      );
      onUpdateChats(finalChats);
    } catch (err) {
      const errorChats = chatsWithLoading.map((c) =>
        c.id === currentChatId
          ? {
              ...c,
              messages: c.messages.map((m: any) =>
                m.id === loadingId ? { ...m, text: "Error fetching AI response." } : m
              ),
            }
          : c
      );
      onUpdateChats(errorChats);
      console.error(err);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Header - Always visible */}
      <div className="flex justify-between items-center p-3 sm:p-4 backdrop-blur-sm border-white/10">
        <div className="flex items-center gap-2">
          {/* Mobile menu button - Always visible on mobile */}
          <button 
            onClick={onToggleSidebar}
            className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors touch-manipulation"
            type="button"
          >
            <Menu size={20} className="text-white" />
          </button>
          
          {/* Choose Model dropdown */}
          <div className="flex gap-1 items-center font-medium hover:bg-white/20 px-2 sm:px-3 py-2 rounded-lg cursor-pointer transition-colors">
            {/* <h3 className="text-sm sm:text-base text-white">Choose Model</h3>
            <ChevronDown className="w-4 h-4 text-white" /> */}
          </div>
        </div>
        
        {/* Profile Circle - Always visible */}
        <div className="rounded-full cursor-pointer flex items-center justify-center bg-amber-600 hover:bg-amber-700 transition-colors w-8 h-8 sm:w-9 sm:h-9">
          <h2 className="font-bold text-sm sm:text-base text-white">M</h2>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-none">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4">
            {!currentChat || currentChat.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[50vh]">
                <div className="text-center px-4">
                  <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl text-white mb-2">
                    How can I help you today?
                  </h2>
                  <p className="text-white/60 text-sm sm:text-base">
                    Ask me anything, and I'll do my best to help!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {currentChat.messages.map((msg: Message) =>
                  msg.type === "request" ? (
                   <RequestBubble key={msg.id} message={msg.text} />
                  ) : (
                     <ResponseBubble key={msg.id} message={msg.text} />
                  )
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area - Sticky at bottom */}
      <div className="">
        <div className="max-w-4xl mx-auto p-3 sm:p-4">
          <div className="bg-black/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
            {/* Text input */}
            <div className="mb-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="
                  w-full text-base sm:text-xl bg-transparent text-white 
                  placeholder:text-white/50 outline-none border-none resize-none 
                  overflow-y-auto custom-scrollbar transition-all duration-150
                "
                placeholder="Ask anything..."
                rows={2}
                style={{
                  fontSize: "20px", // Prevents zoom on iOS
                  lineHeight: "24px", // Consistent with JS calculation
                  maxHeight: "240px", // 10 rows × 24px
                }}
              />
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center">
              {/* Left side - Attach button */}
              <div>
                <button className="bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg px-3 py-2 flex gap-2 items-center text-sm text-white transition-colors touch-manipulation min-h-[44px]">
                  <Paperclip size={16} />
                  <span className="hidden sm:inline">Attach Files</span>
                </button>
              </div>

              {/* Right side - Mic and Send buttons */}
              <div className="flex gap-2">
                <button className="p-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <Mic size={18} className="text-white" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className={`p-2.5 rounded-lg transition-all touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    input.trim() 
                      ? "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white cursor-pointer" 
                      : "bg-green-600/30 text-white/50 cursor-not-allowed"
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;