import { X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Chat } from "../types/chat";

type SearchProps = {
  chats: Chat[];
  onClose: () => void;
  onSelect: (chatId: string) => void;
};

const Search = ({ chats, onClose, onSelect }: SearchProps) => {
  const [query, setQuery] = useState("");

  // Filter chats + messages
  const results = useMemo(() => {
    if (!query.trim()) return [];

    return chats
      .filter((chat) =>
        chat.messages.some((m) =>
          m.text.toLowerCase().includes(query.toLowerCase())
        )
      )
      .map((chat) => ({
        chatId: chat.id,
        chatTitle: chat.title,
      }));
  }, [query, chats]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start sm:items-center justify-center z-[100] p-4">
      <div className="w-full max-w-3xl bg-zinc-900/90 backdrop-blur-sm rounded-2xl shadow-xl relative mt-8 sm:mt-0 max-h-[90vh] sm:max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Search Chats
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-700/50 hover:bg-zinc-800 transition-colors touch-manipulation"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 sm:p-6 pb-2 sm:pb-4">
          <input
            type="text"
            placeholder="Search messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 sm:p-4 rounded-lg border border-white/20 bg-black/40 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-base"
            style={{
              fontSize: "16px", // Prevents zoom on iOS
            }}
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-2 sm:pt-4">
          <div className="space-y-3">
            {query && results.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm sm:text-base">
                  No results found for "{query}"
                </p>
              </div>
            )}

            {!query && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm sm:text-base">
                  Start typing to search your chats...
                </p>
              </div>
            )}

            {results.map((res) => (
              <div
                onClick={() => {
                  onSelect(res.chatId);
                  onClose();
                }}
                key={res.chatId}
                className="p-3 sm:p-4 rounded-lg border border-white/20 bg-black/70 hover:bg-black/90 cursor-pointer transition-all active:bg-black/95 touch-manipulation"
              >
                <p className="text-sm sm:text-base text-white/80">
                  In <span className="font-semibold text-white">{res.chatTitle}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;