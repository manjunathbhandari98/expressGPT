// Sidebar.jsx - Mobile responsive sidebar
import {
  MoreHorizontal,
  Search,
  SidebarClose,
  SidebarOpen,
  SquarePen,
  X
} from 'lucide-react';
import { useState } from 'react';
import { chats } from '../../data/chats';
import type { Chat } from '../../types/chat';
import ExpressGPTLogo from '../logo/ExpressGPTLogo';
type SidebarProps = {
  onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`
      bg-black/40 backdrop-blur-md h-full flex flex-col transition-all duration-300
      ${isCollapsed ? 'w-22' : 'w-64 sm:w-72'}
    `}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 ">
        {/* Logo and title */}
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <ExpressGPTLogo size={28} withText={true} />
           
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Desktop collapse/expand button */}
          <button
            onClick={toggleCollapsed}
                className={`
    ${isCollapsed ? 'w-12 h-12 justify-center' : 'w-full p-3 gap-3'}
    flex items-center hover:bg-white/20 rounded-xl transition-colors touch-manipulation text-white
  `}title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <SidebarOpen size={20} className="text-white" />
            ) : (
              <SidebarClose size={20} className="text-white" />
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors touch-manipulation"
            title="Close sidebar"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="p-4">
          {/* Action buttons */}
          <div className="space-y-2 mb-6">
            <button
              className={`
    ${isCollapsed ? 'w-12 h-12 justify-center' : 'w-full p-3 gap-3'}
    flex items-center hover:bg-white/20 rounded-xl transition-colors touch-manipulation text-white
  `}
              title="New Chat"
            >
              <SquarePen size={20} />
              {!isCollapsed && <span>New Chat</span>}
            </button>

            <button
              className={`
    ${isCollapsed ? 'w-12 h-12 justify-center' : 'w-full p-3 gap-3'}
    flex items-center hover:bg-white/20 rounded-xl transition-colors touch-manipulation text-white
  `}
              title="New Chat"
            >
              <Search size={20} />
              {!isCollapsed && <span>Search Chat</span>}
            </button>
      
          </div>

          {/* Recent Chats - Only show when not collapsed */}
          {!isCollapsed && (
            <div>
              <h3 className="text-white/60 font-semibold mb-3 px-2 text-sm uppercase tracking-wide">
                Recent Chats
              </h3>
              <div className="space-y-1">
                {chats.map((chat: Chat) => (
                  <div
                    key={chat.id}
                    className="group p-3 cursor-pointer hover:bg-white/20 rounded-lg flex justify-between items-center transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate text-white text-sm font-medium">
                        {chat.title}
                      </h4>
                      {/* {chat.lastMessage && (
                        <p className="text-white/50 text-xs truncate mt-1">
                          {chat.lastMessage}
                        </p>
                      )} */}
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2 p-1 cursor-pointer hover:scale-120 rounded">
                      <MoreHorizontal size={16} className="text-white/70" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
