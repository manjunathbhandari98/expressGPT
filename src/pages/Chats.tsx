// Chat.jsx - Main layout component
import { useState } from "react";
import ChatView from "../components/ChatView";
import Sidebar from "../components/sidebar/Sidebar";

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-[100dvh]  relative">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar - Hidden on mobile by default */}
      <div className={`
        fixed md:relative z-50 h-full
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar onClose={closeSidebar} />
      </div>
      
      {/* Main chat area - Full width on mobile */}
      <div className="flex-1 min-w-0 flex flex-col">
        <ChatView onToggleSidebar={toggleSidebar} />
      </div>
    </div>
  );
};

export default Chat;