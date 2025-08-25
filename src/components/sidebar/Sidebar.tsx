import { MoreHorizontal, Search, SidebarClose, SidebarOpen, SquarePen } from 'lucide-react';
import { useState } from 'react';
import { chats } from '../../data/chats';
import type { Chat } from '../../types/chat';
import ExpressGPTLogo from '../logo/ExpressGPTLogo';

const Sidebar = () => {
  const [sidebarClose, setSidebarClose] = useState(false);
  const handleSidebarToggle = () => {
    setSidebarClose((prev) => !prev);
  };

  return (
    <div
      className={`
        bg-black/30 p-4 h-screen flex flex-col
        transition-all duration-300 ease-in-out
        ${sidebarClose ? 'w-[70px]' : 'w-2/7'}
      `}
    >
      {/* Top Header */}
      <div className={`flex justify-between items-center mb-4 ${sidebarClose ? 'flex-col items-center' : ''}`}>
  {!sidebarClose && (
    <div className="p-2 cursor-pointer hover:bg-black/50 rounded-xl">
    <ExpressGPTLogo size={8} withText={false} />
  </div>
  )}
  
  <div className="p-2 cursor-pointer hover:bg-black/50 rounded-xl">
    {sidebarClose ? (
      <SidebarOpen size={28} onClick={handleSidebarToggle} />
    ) : (
      <SidebarClose size={28} onClick={handleSidebarToggle} />
    )}
  </div>
</div>


      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col gap-4">
        {/* Chat Options */}
        <div className={`flex flex-col gap-2 ${sidebarClose ? 'items-center' : ''}`}>
          <div className="flex gap-4 items-center p-4 cursor-pointer hover:bg-black/50 rounded-xl">
            <SquarePen size={26} />
            {!sidebarClose && <h2>New Chat</h2>}
          </div>
          <div className="flex gap-4 items-center p-4 cursor-pointer hover:bg-black/50 rounded-xl">
            <Search size={26} />
            {!sidebarClose && <h2>Search Chat</h2>}
          </div>
        </div>

        {/* Recent Chats */}
        {!sidebarClose && (
          <>
            <h2 className="text-white/50 font-semibold text-lg mb-2">Recent</h2>
            {chats.map((chat: Chat) => (
              <div
                key={chat.id}
                className="group my-0.5 p-3 cursor-pointer hover:bg-black/50 rounded-lg flex justify-between items-center"
              >
                <h4>{chat.title}</h4>
                <MoreHorizontal className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
