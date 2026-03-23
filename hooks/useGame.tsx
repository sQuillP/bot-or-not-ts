import { connectToRoom } from "@/lib/axios";
import { onValue, ref, Unsubscribe } from "firebase/database";
import { useEffect, useRef, useState } from "react";
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
    const connectionRef = useRef<boolean>(false);
    const unsubscribeRef= useRef<Unsubscribe | null>(null);


    async function sendMessage(textMessage: string):Promise<void> {
        try {
            const roomMessage:RoomMessage = {
                created: Date.now(),
                from: userId,
                message: textMessage
            };
            await axios.post<RoomMessage>(`/api/room/${roomId}/message`, roomMessage);
        } catch(error) {
            console.error('Unable to send room message', error);
        }
    }
    

    useEffect(()=> {
        // Prevent unnecessary connections even in dev mode.
        if(connectionRef.current) return;
        connectionRef.current = true;


        (async ()=> {
            try {
                const {roomId, userId} = await connectToRoom();
                if(roomId === '') {
                    console.error("Something went wrong...");
                    return;
                }
                const room = ref(chatClient, `chat/rooms/${roomId}/public`);
                //Listen to incoming messages... we can change this onChildAdded
                // to prevent any extra added cost
                unsubscribeRef.current = onValue(room, (snapshot) => {
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
                connectionRef.current = false;
            }
        })();
        return ()=> {
            if(unsubscribeRef.current){ 
                unsubscribeRef.current();
                unsubscribeRef.current = null;
                connectionRef.current = false
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