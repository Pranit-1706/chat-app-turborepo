import axios from "axios"
import { backend_url } from "../app/config";
import { ChatRoomClient } from "./ChatRoomClient";

async function getChats(roomId: string) {
    console.log("roomId", roomId);
    console.log("backend_url", `${backend_url}/chats/${roomId}`);
    const response = await axios.get(`${backend_url}/chats/${roomId}`);
    console.log("response", response);
    return response.data.message;   
}

export async function ChatRoom({id}:{
    id: string
}) {
    const messages =await getChats(id);

    return <ChatRoomClient id={id} messages={messages}></ChatRoomClient>;
}