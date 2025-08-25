
import ChatView from "../components/ChatView";
import Sidebar from "../components/sidebar/Sidebar";


const Chat = () =>{
    return(
        <div className="flex gap-1">
            <Sidebar/>
            <ChatView/>
        </div>
    );
}

export default Chat;