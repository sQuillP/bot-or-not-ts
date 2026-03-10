"use client";
import { useEffect, useState } from "react";
import { Loading } from "./components/Loading";
import Chat from "./components/Chat";

const states = ["connecting", "finding_game", "game_found"] as const;
export default function ChatPage() {

    const [counter, setCounter] = useState(0);


    useEffect(()=> {

        // const interval = setInterval(() => {
        //     setCounter((prev) =>( prev + 1) % states.length);
        // }, 1000);

        // return () => clearInterval(interval);
    },[]);
    /**
     * WHen a user makes a request to play the game,
     * they will poll the server. If the server finds a game
     * for them to play, then they will be sent a room id.
     * 
     * on the frontend, I will wait for a room to be created for me.
     * 
     * once I receive a room ID, then I should start polling ? 
     * 
     */
    return (
        <main className="h-screen bg-bg-primary">

            {/* <Loading loadingState={states[counter]}/> */}
            <Chat/>


        </main>
    )
}