"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
    id,
    messages
}:{
    id: string,
    messages:{message:String}[]
}){
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState("");
    const {socket, loading} = useSocket();

    useEffect(()=>{
        if(socket && !loading){

            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }))
            socket.onmessage = (event) =>{
                const parsedData = JSON.parse(event.data);
                if(parsedData.type === "chat"){
                    setChats(prevChats => [...prevChats,  {message: parsedData.message} ]);
                }
            }
        }
    }, [loading, socket, id])

    return <div>
        {(chats||[]).map(m=> <div>{m.message}</div>)}

        <input type="text" value={currentMessage} onChange={e=>setCurrentMessage(e.target.value)} />
        <button onClick={()=>{
            socket?.send(JSON.stringify({
                type: "chat",
                roomId: id,
                message: currentMessage
            }));

            setCurrentMessage("");
        }}>Send</button>
    </div>
}