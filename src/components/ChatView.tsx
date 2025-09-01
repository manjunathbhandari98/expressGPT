/* eslint-disable @typescript-eslint/no-explicit-any */
import { Info, Menu, Mic, Paperclip, Send, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { generateResponse, generateTitle } from "../services/geminiServices";
import type { Chat } from "../types/chat";
import type { Message } from "../types/message";
import ExpressGPTLogo from "./logo/ExpressGPTLogo";
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
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<number | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to shrink if text is deleted
      textareaRef.current.style.height = "auto";

      // Calculate new height but cap it at max height
      const lineHeight = 24; // must match CSS line-height
      const maxRows = 10;
      const maxHeight = lineHeight * maxRows;

      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        maxHeight
      ) + "px";
    }
  }, [input]);

  // Auto-scroll only when new prompt is added (not during streaming)
useEffect(() => {
  if (!isStreaming) {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [chats, currentChatId, isStreaming]);


  const currentChat = chats.find((c) => c.id === currentChatId);

  const stopStreaming = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsStreaming(false);
    setStreamingMessageId(null);
  };

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

    // Add streaming message placeholder
    const loadingId = Date.now() + 1;
    const chatsWithLoading = updatedChats.map((c) =>
      c.id === currentChatId
        ? { 
            ...c, 
            messages: [
              ...c.messages, 
              { id: loadingId, type: "response" as const, text: "" }
            ] 
          }
        : c
    );
    onUpdateChats(chatsWithLoading);

    // Set streaming state
    setIsStreaming(true);
    setStreamingMessageId(loadingId);
    
    // Create abort controller for stopping
    const controller = new AbortController();
    setAbortController(controller);

    try {
      // Get the full response first
      const reply = await generateResponse(newMessage.text);
      
      if (controller.signal.aborted) return;

      // Simulate typing effect by updating the message character by character
      const typeMessage = async (fullText: string) => {
        let currentText = "";
        
        for (let i = 0; i < fullText.length; i++) {
          if (controller.signal.aborted) break;
          
          currentText += fullText[i];
          
          // Update the message with current text
          const typingChats = chatsWithLoading.map((c) =>
            c.id === currentChatId
              ? {
                  ...c,
                  messages: c.messages.map((m: Message) =>
                    m.id === loadingId ? { ...m, text: currentText } : m
                  ),
                }
              : c
          );
          onUpdateChats(typingChats);
          
          // Wait before adding next character (typing speed)
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      };

      await typeMessage(reply || "");

      if (controller.signal.aborted) return;

      // Generate title if needed
      let finalTitle = "";
      const finalChats = await Promise.all(
        chatsWithLoading.map(async (c) => {
          if (c.id !== currentChatId) return c;

          // Generate AI-based title if it's still "New Chat"
          if (c.title === "New Chat") {
            const messagesForTitle = [
              ...c.messages.map((m: Message) => ({
                role: m.type === "request" ? "user" : "assistant",
                text: m.text,
              })),
              { role: "user", text: newMessage.text },
              { role: "assistant", text: reply ?? "" },
            ];

            finalTitle = await generateTitle(messagesForTitle);
          }

          return {
            ...c,
            messages: c.messages.map((m: Message) =>
              m.id === loadingId ? { ...m, text: reply ?? "" } : m
            ),
            title: c.title === "New Chat" ? finalTitle : c.title,
          };
        })
      );

      if (!controller.signal.aborted) {
        onUpdateChats(finalChats);
      }
      
    } catch (err) {
      if (!controller.signal.aborted) {
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
    } finally {
      setIsStreaming(false);
      setStreamingMessageId(null);
      setAbortController(null);
    }
  };

  const handleEditRequest = async (messageId: number, newText: string) => {
  if (!currentChatId || isStreaming) return;

  const currentChat = chats.find(c => c.id === currentChatId);
  if (!currentChat) return;

  // Find the index of the message being edited
  const messageIndex = currentChat.messages.findIndex(m => m.id === messageId);
  if (messageIndex === -1) return;

  // Create new message with edited text
  const editedMessage: Message = {
    id: messageId,
    type: "request",
    text: newText,
  };

  // Remove all messages after the edited one (including the response)
  const messagesUpToEdit = currentChat.messages.slice(0, messageIndex);
  const updatedMessages = [...messagesUpToEdit, editedMessage];

  // Update the chat with only messages up to and including the edited one
  const updatedChats = chats.map((c) =>
    c.id === currentChatId
      ? { ...c, messages: updatedMessages }
      : c
  );
  onUpdateChats(updatedChats);

  // Generate new response for the edited message
  const loadingId = Date.now();
  const chatsWithLoading = updatedChats.map((c) =>
    c.id === currentChatId
      ? { 
          ...c, 
          messages: [
            ...c.messages, 
            { id: loadingId, type: "response" as const, text: "" }
          ] 
        }
      : c
  );
  onUpdateChats(chatsWithLoading);

  // Set streaming state
  setIsStreaming(true);
  setStreamingMessageId(loadingId);
  
  // Create abort controller
  const controller = new AbortController();
  setAbortController(controller);

  try {
    // Get the full response
    const reply = await generateResponse(newText);
    
    if (controller.signal.aborted) return;

    // Simulate typing effect
    const typeMessage = async (fullText: string) => {
      let currentText = "";
      
      for (let i = 0; i < fullText.length; i++) {
        if (controller.signal.aborted) break;
        
        currentText += fullText[i];
        
        const typingChats = chatsWithLoading.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                messages: c.messages.map((m: Message) =>
                  m.id === loadingId ? { ...m, text: currentText } : m
                ),
              }
            : c
        );
        onUpdateChats(typingChats);
        
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    };

    await typeMessage(reply || "");

    if (controller.signal.aborted) return;

    // Update with final response
    const finalChats = chatsWithLoading.map((c) =>
      c.id === currentChatId
        ? {
            ...c,
            messages: c.messages.map((m: Message) =>
              m.id === loadingId ? { ...m, text: reply ?? "" } : m
            ),
          }
        : c
    );

    if (!controller.signal.aborted) {
      onUpdateChats(finalChats);
    }
    
  } catch (err) {
    if (!controller.signal.aborted) {
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
  } finally {
    setIsStreaming(false);
    setStreamingMessageId(null);
    setAbortController(null);
  }
};

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming) {
        sendMessage();
      }
    }
  };

  return (
    <div className="flex flex-col h-full  pt-16 sm:pt-0">
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
        <div className="flex items-center sm:items-center gap-2 rounded-lg border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-600 p-3 text-xs sm:text-sm text-yellow-800 dark:text-yellow-200 max-w-full sm:max-w-lg">
  <Info className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" />
  <p className="leading-snug">
    Chats and profiles are not stored yet — everything will be lost once you refresh or close the app.
  </p>
</div>

        {/* Profile Circle - Always visible */}
        <div className="rounded-full hidden cursor-pointer sm:flex items-center justify-center bg-transparent transition-colors w-8 h-8 sm:w-9 sm:h-9">
          {/* <h2 className="font-bold text-sm sm:text-base text-white"></h2> */}
          <ExpressGPTLogo size={14} withText={false}/>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-none">
          <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6">

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
    <RequestBubble 
      key={msg.id} 
      message={msg.text}
      messageId={msg.id}
      isStreaming={isStreaming}
      onEditRequest={handleEditRequest}
    />
  ) : (
    <ResponseBubble 
      key={msg.id} 
      message={msg.text} 
      isStreaming={isStreaming && msg.id === streamingMessageId}
    />
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
                disabled={isStreaming}
                className={`
                  w-full text-base sm:text-lg bg-transparent text-white 
                  placeholder:text-white/50 outline-none border-none resize-none 
                  overflow-y-auto custom-scrollbar transition-all duration-150
                  ${isStreaming ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                placeholder={isStreaming ? "AI is typing..." : "Ask anything..."}
                rows={2}
                style={{
                  fontSize: "15px", // Prevents zoom on iOS
                  lineHeight: "24px", // Consistent with JS calculation
                  maxHeight: "240px", // 10 rows × 24px
                }}
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-2">
  {/* Left side - Attach button */}
  <button 
    disabled={isStreaming}
    className={`flex-1 hidden sm:flex-none justify-center bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg px-3 py-2 sm:flex gap-2 items-center text-sm text-white transition-colors touch-manipulation min-h-[44px] ${
      isStreaming ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    <Paperclip size={16} />
    <span>Attach Files</span>
  </button>

  {/* Right side - Mic + Send */}
  <div className="flex gap-2 justify-center sm:justify-end">
    <button 
    disabled={isStreaming}
    className={`flex-1 sm:hidden sm:flex-none justify-center bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg px-3 py-2 flex gap-2 items-center text-sm text-white transition-colors touch-manipulation min-h-[44px] ${
      isStreaming ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    <Paperclip size={16} />
    <span>Attach File</span>
  </button>
    <button 
      disabled={isStreaming}
      className={`p-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${
        isStreaming ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <Mic size={18} className="text-white" />
    </button>

    {isStreaming ? (
      <button
        onClick={stopStreaming}
        className="p-2.5 rounded-lg transition-all touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center bg-red-600 hover:bg-red-700 active:bg-red-800 text-white cursor-pointer"
      >
        <Square size={18} fill="currentColor" />
      </button>
    ) : (
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
    )}
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;