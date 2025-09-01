import { X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Chat } from "../types/chat";

type SearchProps = {
  chats: Chat[];
  onClose: () => void;
  onSelect:(chatId:string) => void;
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
      <div className="w-full max-w-3xl bg-zinc-900/60 rounded-2xl shadow-xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-zinc-700/50 hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Search Chats
        </h2>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search messages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-lg border bg-black/40"
        />

        {/* Results */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-3">
          {results.length === 0 && query && (
            <p className="text-gray-500 text-center">No results found</p>
          )}

          {results.map((res) => (
            <div
            onClick={() => 
            {
                onSelect(res.chatId)
                onClose();
            }

            }
              key={res.chatId}
              className="p-3 rounded-lg border bg-black/70 cursor-pointer"
            >
              <p className="text-xs text-white">
                In <span className="font-semibold">{res.chatTitle}</span>
              </p>
             
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
