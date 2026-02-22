"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { CircleCheckBig, Search, Unplug } from "lucide-react";
import { JSX } from "react";

type ModalLoadingState = "connecting" | "finding_game" | "game_found";


const loadingStateIcons:Record<ModalLoadingState, JSX.Element> = {
    connecting: <Unplug size={45} className="text-teal"/>,
    finding_game: <Search size={45} className="text-teal"/>,
    game_found: <CircleCheckBig size={45} className="text-teal"/>
}


const loadingStateText:Record<ModalLoadingState, string> = {
    connecting: "Connecting to server...",
    finding_game: "Finding a game...",
    game_found: "Found a game!"
}

const progressCount:Record<ModalLoadingState, number> = {
    connecting: 1,
    finding_game: 2,
    game_found: 3
}

export function Loading({loadingState = "connecting"}: {loadingState: ModalLoadingState}) {

    return (
        <Dialog open={true}>
            <DialogContent className="bg-bg-primary">
                <DialogTitle hidden></DialogTitle>
                <div className="flex flex-col items-center justify-center">
                    <div className="rounded-full border-teal border-4 p-4 border-box">
                         <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse" />
                        {loadingStateIcons[loadingState]}
                    </div>
                   
                    <p className="text-white text-center mt-5">
                        {loadingStateText[loadingState]}
                    </p>
                    <div className="flex space-x-2 mt-5">
                        <div className={`rounded-full ${progressCount[loadingState] >= 1 ? 'bg-teal' : 'bg-gray-500'} h-2 transition-colors w-2 duration-500`}></div>
                        <div className={`rounded-full ${progressCount[loadingState] >= 2 ? 'bg-teal' : 'bg-gray-500'} h-2 transition-colors w-2 duration-500`}></div>
                        <div className={`rounded-full ${progressCount[loadingState] >= 3 ? 'bg-teal' : 'bg-gray-500'} h-2 transition-colors w-2 duration-500`}></div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
