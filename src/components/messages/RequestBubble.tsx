import { Check, Copy, Pencil } from "lucide-react";
import { useState } from "react";

type ResponseBubbleProps = {
  message: string;
};

const RequestBubble = ({ message }: ResponseBubbleProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex flex-col ">
       <div className="flex my-4 items-end justify-end w-full">
      <div className="flex items-end gap-2 max-w-[70%]">
        <div
          className="
            bg-white/10 text-white text-lg p-3 
            rounded-l-xl rounded-t-xl flex flex-col relative
            whitespace-pre-wrap break-words
          "
        >
          <span>{message}</span>
        </div>
      </div>
    </div>
    <div className="flex justify-end">
      <div className="flex gap-5">
         <button
              className={`
    flex items-center cursor-pointer rounded-xl transition-colors touch-manipulation text-white
  `}
              title="Edit"
            >
              <Pencil />
            </button>
             <button
             onClick={handleCopy}
              className={`
    flex items-center cursor-pointer rounded-xl transition-colors touch-manipulation text-white
  `}
              title="Copy"
            >
             {copied ? <Check/> : <Copy />} 
            </button>
      </div>
    </div>
    </div>
   
  );
};

export default RequestBubble;
