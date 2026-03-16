import { connectToRoom } from "@/lib/axios";
import { onValue, ref } from "firebase/database";
import { useEffect } from "react";
import chatClient from "@/lib/firebase";


// once initialized / called, make a connection to the server.
export default function useGame() {


    useEffect(()=> {

        let room = null;
        ( async ()=> {
            // we should be able to retrieve a valid room id here.
            const roomData = await connectToRoom();

            //with that room id, we can then be able to connect
            //to our room and listen whether or not we have 
            //a user or not.


            console.log(roomData);
            // room = ref('')
            // onValue(chatClient, `chat/rooms/${roomData.roomid}/content`)
        })();

    },[]);
}