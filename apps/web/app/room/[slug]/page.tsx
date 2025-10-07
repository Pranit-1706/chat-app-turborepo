import axios from "axios";
import { backend_url } from "../../config";
import { ChatRoom } from "../../../components/ChatRoom";

async function getRoomDetails(slug: string) {
    console.log("slug", slug);
    const response =await axios.get(`${backend_url}/room/${slug}`);
    return response.data.room.id;
}

export default async function chatRoom1({
    params,
}:{
    params:{slug: string}
}) {
    const slug =  (await params).slug;

    const roomId =await getRoomDetails(slug);
    console.log("roomId", roomId);

    return <ChatRoom id={roomId}></ChatRoom>;
}