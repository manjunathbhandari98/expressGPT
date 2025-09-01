import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatView from "../components/ChatView";
import Sidebar from "../components/sidebar/Sidebar";
import type { Chat } from "../types/chat";
import Search from "./Search";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  const isSearch = location.pathname === "/search";

  // Load chats from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chats");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Chat[];
        const restored = parsed.map((c) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        }));
        setChats(restored);

        if (restored.length > 0) {
          const lastChat = restored[restored.length - 1];
          setCurrentChatId(lastChat.id);
        }
      } catch (e) {
        console.error("Failed to restore chats", e);
      }
    }
  }, []);

  // Save chats
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setSidebarOpen(false);
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setChats((prev) => [...prev, newChat]);
    setCurrentChatId(newChat.id);
    setSidebarOpen(false);
  };

  const updateChats = (updatedChats: Chat[]) => setChats(updatedChats);

  const handleDeleteChat = (chatIdToDelete: string) => {
    if (chats.length <= 1) return;

    const updatedChats = chats.filter((chat) => chat.id !== chatIdToDelete);
    setChats(updatedChats);

    if (currentChatId === chatIdToDelete) {
      const newActiveChatId =
        updatedChats.length > 0 ? updatedChats[0].id : null;
      setCurrentChatId(newActiveChatId);
    }
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    const updatedChats = chats.map((chat) =>
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    );
    setChats(updatedChats);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 
        fixed md:relative z-50 md:z-0 
        h-full transition-transform duration-300 ease-in-out`}
      >
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          onSelectChat={selectChat}
          onCreateNewChat={createNewChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
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

      {/* Search Modal */}
      {isSearch && (
        <Search
          chats={chats}
          onClose={() => navigate("/")} 
          onSelect = {(id:string) => selectChat(id) }
        />
      )}
    </div>
  );
};

export default Chat;
