import ChatView from "../ChatView";
import Sidebar from "../sidebar/Sidebar";

const Chat = () =>{
    return(
        <div className="grid md:grid-cols-[3fr_10fr] h-screen">
            <Sidebar/>
            <ChatView/>
        </div>
    );
}

export default Chat;