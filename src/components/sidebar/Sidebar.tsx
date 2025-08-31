// Sidebar.tsx - Mobile responsive sidebar with chat management
import {
  Check,
  Edit3,
  MoreHorizontal,
  Search,
  Share,
  SidebarClose,
  SidebarOpen,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Chat } from "../../types/chat";
import ExpressGPTLogo from "../logo/ExpressGPTLogo";

type SidebarProps = {
  onClose: () => void;
  onSelectChat?: (chatId: string) => void;
  onCreateNewChat: () => void;
  onDeleteChat?: (chatId: string) => void;
  onRenameChat?: (chatId: string, newTitle: string) => void;
  onShareChat?: (chatId: string) => void;
  chats: Chat[];
  activeChatId: string | null;
};

const Sidebar: React.FC<SidebarProps> = ({ 
  onClose, 
  onSelectChat, 
  onCreateNewChat,
  onDeleteChat,
  onRenameChat,
  onShareChat,
  chats,
  activeChatId 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  //Auto-create a new chat if none exist
  useEffect(() => {
    if (chats.length === 0) {
      onCreateNewChat();
    }
  }, [chats, onCreateNewChat]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Focus input when editing starts
  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingChatId]);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
    setActiveDropdown(null); // Close any open dropdowns
  };

  const selectChat = (chatId: string) => {
    if (editingChatId) return; // Don't select if editing
    onSelectChat?.(chatId);
    setActiveDropdown(null);
  };

  const handleMoreClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === chatId ? null : chatId);
  };

  const handleRenameStart = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
    setActiveDropdown(null);
  };

  const handleRenameCancel = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  const handleRenameSave = (chatId: string) => {
    const trimmedTitle = editingTitle.trim();
    if (trimmedTitle && trimmedTitle !== chats.find(c => c.id === chatId)?.title) {
      onRenameChat?.(chatId, trimmedTitle);
    }
    setEditingChatId(null);
    setEditingTitle("");
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      handleRenameSave(chatId);
    } else if (e.key === 'Escape') {
      handleRenameCancel();
    }
  };

  const handleDelete = (chatId: string) => {
    onDeleteChat?.(chatId);
    setActiveDropdown(null);
  };

  const handleShare = (chatId: string) => {
    onShareChat?.(chatId);
    setActiveDropdown(null);
  };

  return (
    <div
      className={`
        bg-black/40 backdrop-blur-md h-full flex flex-col transition-all duration-300
        ${isCollapsed ? "w-20" : "w-64 sm:w-72"}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4">
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
              ${isCollapsed ? "w-12 h-12 justify-center" : "w-full p-3 gap-3"}
              flex items-center hover:bg-white/20 rounded-xl transition-colors touch-manipulation text-white
            `}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <SidebarOpen size={20} className="text-white" />
            ) : (
              <SidebarClose size={20} className="text-white hidden sm:flex" />
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
              onClick={onCreateNewChat}
              className={`
                ${isCollapsed ? "w-12 h-12 justify-center" : "w-full p-3 gap-3"}
                flex items-center hover:bg-white/20 rounded-xl transition-colors touch-manipulation text-white
              `}
              title="New Chat"
            >
              <SquarePen size={20} />
              {!isCollapsed && <span>New Chat</span>}
            </button>

            <button
              className={`
                ${isCollapsed ? "w-12 h-12 justify-center" : "w-full p-3 gap-3"}
                flex items-center hover:bg-white/20 rounded-xl transition-colors touch-manipulation text-white
              `}
              title="Search Chat"
            >
              <Search size={20} />
              {!isCollapsed && <span>Search Chat</span>}
            </button>
          </div>

          {/* Recent Chats */}
          {!isCollapsed && (
            <div>
              <h3 className="text-white/60 font-semibold mb-3 px-2 text-sm uppercase tracking-wide">
                Recent Chats
              </h3>
              <div className="space-y-1">
                {chats.map((chat: Chat) => (
                  <div
                    key={chat.id}
                    className={`group p-3 cursor-pointer rounded-lg flex justify-between items-center transition-colors relative dropdown-container ${
                      chat.id === activeChatId
                        ? "bg-white/20"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <div 
                      className="flex-1 min-w-0"
                      onClick={() => selectChat(chat.id)}
                    >
                      {editingChatId === chat.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            ref={editInputRef}
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => handleRenameKeyDown(e, chat.id)}
                            className="flex-1 bg-white/10 text-white text-sm px-2 py-1 rounded border border-white/30 outline-none focus:border-white/60"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenameSave(chat.id);
                            }}
                            className="p-1 hover:bg-white/20 rounded text-green-400"
                            title="Save"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenameCancel();
                            }}
                            className="p-1 hover:bg-white/20 rounded text-red-400"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <h4 className="truncate text-white text-sm font-medium">
                          {chat.title}
                        </h4>
                      )}
                    </div>

                    {editingChatId !== chat.id && (
                      <div className="relative">
                        <button 
                          onClick={(e) => handleMoreClick(e, chat.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2 p-1 cursor-pointer hover:scale-110 rounded hover:bg-white/20"
                          title="More options"
                        >
                          <MoreHorizontal size={16} className="text-white/70" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdown === chat.id && (
                          <div className="absolute right-0 top-8 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-10 min-w-[140px]">
                            <button
                              onClick={() => handleRenameStart(chat.id, chat.title)}
                              className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2 first:rounded-t-lg transition-colors"
                            >
                              <Edit3 size={14} />
                              Rename
                            </button>
                            <button
                              onClick={() => handleShare(chat.id)}
                              className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
                            >
                              <Share size={14} />
                              Share
                            </button>
                            <button
                              onClick={() => handleDelete(chat.id)}
                              className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2 last:rounded-b-lg transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
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