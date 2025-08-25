import { ChevronDown, Mic, Paperclip, SendHorizonal } from "lucide-react";
import { useState } from "react";

const ChatView = () =>{
    const [currentChat, setCurrentChat] = useState(false);
    return (
        <div className="p-3 flex flex-col justify-between w-full">
            <div className="flex justify-between">
                <div className="flex gap-1 items-center font-medium hover:bg-black/50 p-3 rounded-2xl">
                    <h3 className="text-lg">Choose Modal</h3>
                    <ChevronDown className="mt-1"/>
                </div>
                <div className="rounded-full cursor-pointer items-center text-center justify-center bg-amber-800 w-10 h-10">
                    <h2 className="font-bold text-xl mt-1.5">M</h2>
                </div>
            </div>
            {currentChat ? (
                <div></div>
            ) : (
                <div className="flex justify-center font-bold text-3xl">
                    <h2>How can I help you today?</h2>
                </div>
            )}

            <div className="group w-2/3 mx-auto rounded-xl space-y-4 p-3 bg-white/10">
                <div className="flex flex-col gap-3">
                    <input type="text" name="" id="" className="w-full text-xl p-3 placeholder:text-lg outline-0 border-0" placeholder="Ask anything" />
                </div>
                <div className="flex justify-between p-1.5">
                    <div className="flex gap-2">
                        <div className="bg-white/5 rounded-lg px-2 py-1 flex gap-2 items-center">
                            <Paperclip size={16}/>
                            <h2>Attach Files</h2>
                        </div>
                    </div>
                    <div className="flex gap-2 [&>div]:cursor-pointer">
                        <div className="p-2 bg-white/5 rounded-lg">

                        <Mic size={20}/>
                        </div>
                        <div className="p-2 bg-green-500/70 rounded-lg">

                        <SendHorizonal size={20} onClick={() => setCurrentChat(true)}
                            
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatView;