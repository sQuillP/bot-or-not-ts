"use client";
import { useEffect, useState } from "react";
import { Loading } from "./components/Loading";
import Chat from "./components/Chat";
import useGame from "@/hooks/useGame";

const states = ["connecting", "finding_game", "game_found"] as const;
export default function ChatPage() {

    const [counter, setCounter] = useState(0);

    const gameState = useGame();

    
   
    return (
        
        <main className="h-screen  bg-bg-primary">

                <Loading loadingState={states[counter]}/>
                <Chat/>


        </main>
    )
}