import { connectToRoom, poll } from "@/lib/axios";
import { onValue, ref, Unsubscribe } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import chatClient from "@/lib/firebase";
import { ChatRoom, END_STATES, RoomMessage } from "@/types/server.types";
import axios from "axios";

export interface UseGameResult {
    messages: RoomMessage[];
    roomId:string;
    userId: string;
    sendMessage: (message:string)=> Promise<void>;
    winner: boolean | undefined;
    playerGuess: END_STATES | undefined;
    guesserId: string | undefined;
    // anything else goes in here.
}

const POLL_INTERVAL_MS = 1500;

function extractChat(room:ChatRoom['public']):RoomMessage[] {
    return Object.keys(room.messages || {}).map(k => room.messages![k]);
}

// once initialized / called, make a connection to the server.
export default function useGame():UseGameResult {

    const [messages, setMessages] = useState<RoomMessage[]>([]);
    const [roomId, setRoomId] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const connectionRef = useRef<boolean>(false);
    const unsubscribeRef= useRef<Unsubscribe | null>(null);
    // find the winner throughout the app.
    const [playerGuess, setPlayerGuess] = useState<END_STATES | undefined>();
    const [winner, setWinner] = useState<boolean | undefined>(false);
    const [guesserId, setGuesserId] = useState<string | undefined>(undefined);

    // some extra state
    const [gameReady, setGameReady] = useState<boolean>(false);

    const [foo, setFoo] = useState<string>('');
    
    //some state for managing the session polling.
    const [pollStart, setPollStart] = useState<boolean>(false);

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


    // Do polling for a room.
    useEffect(()=> {
        if(pollStart === false || !roomId) return;

        const interval = setInterval( async ()=> {
            console.log('polling')
            void await poll(roomId);
        }, POLL_INTERVAL_MS);

        return ()=>{
            if(interval)
                clearInterval(interval);
        };
    },[pollStart, roomId]);


    

    //TODO: Refactor this crap
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
                    console.log("room event received", room);
                    // extract the chat state from the room
                    setMessages(extractChat(room));
                    setRoomId(roomId);
                    setUserId(userId);
                    setWinner(!room.winner ? undefined : room.winner === userId);
                    setPlayerGuess(!room.playerGuess ? undefined : room.playerGuess);
                    setGuesserId(!room.guesserId ? undefined : room.guesserId);
                    setGameReady(room.gameReady);

                    //Only start polling if game is not in a ready state.
                    setPollStart(!room.gameReady);
                }, console.error);
            } catch(error) {
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
        sendMessage,
        winner,
        playerGuess,
        guesserId
    }
}