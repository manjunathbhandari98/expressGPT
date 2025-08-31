// Chat.jsx - Main layout component
import { useEffect, useState } from "react";
import ChatView from "../components/ChatView";
import Sidebar from "../components/sidebar/Sidebar";
import type { Chat } from "../types/chat";


const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  // Load chats from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chats");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Chat[];
        // Convert createdAt back to Date objects
        const restored = parsed.map((c) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        }));
        setChats(restored);

        // Auto select last chat if exists
        if (restored.length > 0) {
          const lastChat = restored[restored.length - 1];
          setCurrentChatId(lastChat.id);
        }
      } catch (e) {
        console.error("Failed to restore chats", e);
      }
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setSidebarOpen(false); // Close sidebar on mobile when chat is selected
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(), // Using string ID
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setChats((prev) => [...prev, newChat]);
    setCurrentChatId(newChat.id);
    setSidebarOpen(false); // Close sidebar on mobile after creating new chat
  };

  const updateChats = (updatedChats: Chat[]) => {
    setChats(updatedChats);
  };

  const handleDeleteChat = (chatIdToDelete: string) => {
  // Don't delete if it's the only chat
  if (chats.length <= 1) {
    // Optionally show a message that you need at least one chat
    return;
  }

  // Remove the chat from the list
  const updatedChats = chats.filter(chat => chat.id !== chatIdToDelete);
  setChats(updatedChats);

  // If the deleted chat was the active one, select another chat
  if (currentChatId === chatIdToDelete) {
    // Select the first available chat
    const newActiveChatId = updatedChats.length > 0 ? updatedChats[0].id : null;
    setCurrentChatId(newActiveChatId);
  }
};

const handleRenameChat = (chatId: string, newTitle: string) => {
  const updatedChats = chats.map(chat =>
    chat.id === chatId
      ? { ...chat, title: newTitle }
      : chat
  );
  setChats(updatedChats);
};

const handleShareChat = async (chatId: string) => {
  const chatToShare = chats.find(chat => chat.id === chatId);
  if (!chatToShare) return;

  // Create a shareable text version of the chat
  const chatText = chatToShare.messages
    .map(msg => `${msg.type === 'request' ? 'User' : 'AI'}: ${msg.text}`)
    .join('\n\n');

  const shareData = {
    title: `Chat: ${chatToShare.title}`,
    text: chatText
  };

  try {
    // Use Web Share API if available (mobile devices)
    if (navigator.share && navigator.canShare?.(shareData)) {
      await navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}`);
      
      // Optionally show a toast/notification
      // showNotification("Chat copied to clipboard!");
      alert("Chat copied to clipboard!");
    }
  } catch (error) {
    console.error('Error sharing chat:', error);
    
    // Fallback: try copying to clipboard
    try {
      await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}`);
      alert("Chat copied to clipboard!");
    } catch (clipboardError) {
      console.error('Error copying to clipboard:', clipboardError);
      alert("Unable to share or copy chat.");
    }
  }
};

  return (
    <div className="h-screen flex ">
      {/* Sidebar - Desktop always visible, Mobile overlay */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 
        fixed md:relative z-50 md:z-0 
        h-full transition-transform duration-300 ease-in-out
      `}>
        
<Sidebar
  onClose={() => setSidebarOpen(false)}
  onSelectChat={selectChat}
  onCreateNewChat={createNewChat}
  onDeleteChat={handleDeleteChat}
  onRenameChat={handleRenameChat}
  onShareChat={handleShareChat}
  chats={chats}
  activeChatId={currentChatId}
/>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 h-full">
        <ChatView
          onToggleSidebar={toggleSidebar}
          currentChatId={currentChatId}
          chats={chats}
          onUpdateChats={updateChats}
          onCreateNewChat={createNewChat}
        />
      </div>
    </div>
  );
};

export default Chat;