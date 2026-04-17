"use client";
import { useState } from "react";
import Chat from "./components/Chat";
import GuessResultScreen from "./components/GuessResultScreen";
import { END_STATES } from "@/types/server.types";

export interface ChatPageState {
    winner: boolean | undefined;
    reason: END_STATES | undefined;
    guesserId: string | undefined;
    userId:string | undefined;
}

export default function ChatPage() {

    const [gameResultData, setGameResultData] = useState<ChatPageState>({
        winner: undefined, 
        reason: undefined,
        guesserId: undefined,
        userId: undefined
    });
    
   
    return (
        <main className="h-screen  bg-bg-primary">
            {
                (gameResultData.reason && gameResultData.winner !== undefined && gameResultData.userId !== undefined) ? (
                    <GuessResultScreen userId={gameResultData.userId} guesserId={gameResultData.guesserId} winner={gameResultData.winner} reason={gameResultData.reason}/>
                ): (
                    <Chat 
                        setGameResultData={setGameResultData}
                    />
                )
            }
        </main>
    )
}