import { connectToRoom } from "@/lib/axios";
import { DatabaseReference, off, onValue, push, ref } from "firebase/database";
import { useEffect, useState } from "react";
import chatClient from "@/lib/firebase";
import { ChatRoom, RoomMessage } from "@/types/server.types";
import axios from "axios";

interface UseGameResult {
    messages: RoomMessage[];
    roomId:string;
    userId: string;
    sendMessage: (message:string)=> Promise<void>;
    connected:boolean;
    // anything else goes in here.
}

function extractChat(room:ChatRoom['public']):RoomMessage[] {
    return Object.keys(room.messages || {}).map(k => room.messages![k]);
}

// once initialized / called, make a connection to the server.
export default function useGame():UseGameResult {

    const [messages, setMessages] = useState<RoomMessage[]>([]);
    const [roomId, setRoomId] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [connected, setConnected] = useState<boolean>(false);


    async function sendMessage(textMessage: string):Promise<void> {
        try {
            const roomMessage:RoomMessage = {
                created: Date.now(),
                from: userId,
                message: textMessage
            };
            await axios.post<RoomMessage>(`/api/room/${roomId}/message`, roomMessage);
        } catch(error) {
            console.error('Unable to send room message');
        }
    }
    

    useEffect(()=> {
        let room:DatabaseReference;
        (async ()=> {
            try {
                const {roomId, userId} = await connectToRoom();
                console.log(roomId, userId);
                if(roomId === '') {
                    console.error("Something went wrong...");
                    return;
                }
                room = ref(chatClient, `chat/rooms/${roomId}/public`);

                //Listen to incoming messages...
                onValue(room, (snapshot) => {
                    if(snapshot.exists() === false) return;
                    const room:ChatRoom['public'] = snapshot.val();
                    setMessages(extractChat(room));
                    setRoomId(roomId);
                    setUserId(userId);
                    setConnected(true)
                }, console.error);
            } catch(error) {
                setConnected(false);
                console.error(error);
            }
        })();
        return ()=> {
            if(room){
                off(room);
            }
        }
    },[]);

    return {
        messages,
        roomId,
        userId,
        connected,
        sendMessage
    }
}