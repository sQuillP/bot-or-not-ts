"use client";
import { useEffect, useState } from "react";
import { Loading } from "./components/Loading";
import Chat from "./components/Chat";
import useGame from "@/hooks/useGame";
import GuessResultScreen from "./components/GuessResultScreen";
import { END_STATES } from "@/types/server.types";

const states = ["connecting", "finding_game", "game_found"] as const;


export default function ChatPage() {


    const [verdict, setVerdict] = useState<END_STATES | undefined>();
    const [isWinner, setIsWinner] = useState<boolean | undefined>();


    
   
    return (
        <main className="h-screen  bg-bg-primary">
            {
                (verdict && isWinner !== undefined) ? (
                    <GuessResultScreen winner={isWinner} reason={verdict}/>
                ): (
                    <Chat 
                        setVerdict={(v) => setVerdict(v)}
                        setIsWinner={(w) => setIsWinner(w)}
                    />
                )
            }
        </main>
    )
}