import { MoreHorizontal, Search, SidebarClose, SquarePen } from 'lucide-react';
import { chats } from '../../data/chats';
import type { Chat } from '../../types/chat';
import ExpressGPTLogo from '../logo/ExpressGPTLogo';

const Sidebar = () => {
  return (
    <div className="bg-black/30 p-4">
      {/* Top Header */}
      <div className="overflow-y-auto h-screen scrollbar-none">
        <div className="flex justify-between items-center">
          <div className="p-2 cursor-pointer hover:bg-black/50 rounded-xl">
            <ExpressGPTLogo size={8} withText={false} />
          </div>
          <div className="p-2 cursor-pointer hover:bg-black/50 rounded-xl">
            <SidebarClose size={28} />
          </div>
        </div>

        {/* Chat Options */}
        <div className="flex flex-col gap-2 my-10">
          <div className="flex gap-4 items-center p-4 cursor-pointer hover:bg-black/50 rounded-xl">
            <SquarePen />
            <h2>New Chat</h2>
          </div>
          <div className="flex gap-4 items-center p-4 cursor-pointer hover:bg-black/50 rounded-xl">
            <Search />
            <h2>Search Chat</h2>
          </div>
        </div>

        {/* Recent Chats */}
        <h2 className="text-white/50 font-semibold text-lg">Recent</h2>
        {chats.map((chat: Chat) => (
          <div
            key={chat.id}
            className="group my-2 p-3 cursor-pointer hover:bg-black/50 rounded flex justify-between items-center"
          >
            <h4>{chat.title}</h4>
            <MoreHorizontal className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
