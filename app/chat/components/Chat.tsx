import { Bot, Power, Send, User } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ChatBubble from "./ChatBubble";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {useRouter} from "next/navigation";

export default function Chat() {

    const [openDisconnectModal, setOpenDisconnectModal] = useState<boolean>(false);

    /**
     * game state:
     * 
     * win - guess the other identity
     * win - other player incorrectly guesses your identity
     * win - other player forfeits
     * 
     * lose - you guess the other identity wrong
     * lose - other player correctly guesses your identity
     * lose - you forfeit
     * 
     * 
     * is the game over?
     * 
     * then what's the state.
     * 
     * game over ? 
     * 
     */

    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    function onLeaveGame():void {
        // make api call to leave game, then redirect to home page or something.
        router.push('/');
    }


    function onDecideUser(isBot: boolean):void {
        
    }



    return (
        <main className="h-screen flex flex-col justify-between bg-bg-primary text-white">
            <ChatHeader totalTime={10} onTriggerDisconnect={() => setOpenDisconnectModal(true)} onComplete={()=> null}/>
            <section ref={scrollRef} className="h-full overflow-y-auto scrollbar-none  [&::-webkit-scrollbar]:hidden">
                <div className="space-y-4 p-3">
                    {/* This is where you are going to render your messages.... */}
                    {Array.from({length: 25}).map((_, i) => (<ChatBubble key={i} text={`Message ${i + 1}`} isMe={i % 2 === 0} />))}
                </div>
            </section>
            <section className="">
                <div className="flex justify-between bg-card-bg p-4 border-box border-2 border-b-0">
                    <button className="border-2 border-teal hover:bg-teal hover:text-white transition cursor-pointer p-2 rounded w-full mr-1 text-teal outline-none">
                        <div className="flex items-center justify-center gap-2 rounded">
                            <Bot size={20}/>
                            It&apos;s a Bot
                        </div>
                    </button>
                    <button className="border-2 border-purple hover:bg-purple hover:text-white transition cursor-pointer p-2 rounded w-full text-purple outline-none text-center">
                        <div className="flex items-center justify-center gap-2 rounded">
                            <User size={20}/>
                            Not a Bot
                        </div>
                    </button>
                </div>
                <div className="flex flex-row p-3 border-box gap-2 bg-card-bg border-t-2">
                    <textarea placeholder="Type your message here..." className="focus:border-teal focus:outline-none w-full bg-card-bg text-black rounded outline-hidden text-white p-3 border-box resize-none border-2 transition mr-1" />
                    <button className="rounded bg-teal w-19 h-19 m-auto cursor-pointer"><Send className="m-auto"/></button>
                </div>
            </section>
            <Dialog open={openDisconnectModal} onOpenChange={setOpenDisconnectModal}>
                <DialogContent className="bg-gray-800 p-5">
                <DialogHeader>
                    <DialogTitle className="text-red-500 flex justify-left gap-2 items-center"> <Power size={20}/> Disconnect from session?</DialogTitle>
                    <DialogDescription className="text-gray-300">
                        This game will end promptly when doing so and you may lose rank.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-5">
                    <DialogClose asChild>
                        <button className="rounded-[10px] bg-card-bg p-3 text-white text-sm cursor-pointer hover:bg-gray-600 transition">Stay connected</button>
                    </DialogClose>
                    <button onClick={onLeaveGame} className="rounded-[10px] bg-red-800 p-3 text-white text-sm cursor-pointer hover:bg-red-600 transition">Pull the plug</button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* <Dialog open={} onOpenChange={setOpenDisconnectModal}>
                <DialogContent className="bg-gray-800 p-5">
                <DialogHeader>
                    <DialogTitle className="text-red-500 flex justify-left gap-2 items-center"> <Power size={20}/> Disconnect from session?</DialogTitle>
                    <DialogDescription className="text-gray-300">
                        This game will end promptly when doing so and you may lose rank.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-5">
                    <DialogClose asChild>
                        <button className="rounded-[10px] bg-card-bg p-3 text-white text-sm cursor-pointer hover:bg-gray-600 transition">Stay connected</button>
                    </DialogClose>
                    <button onClick={onLeaveGame} className="rounded-[10px] bg-red-800 p-3 text-white text-sm cursor-pointer hover:bg-red-600 transition">Pull the plug</button>
                </DialogFooter>
                </DialogContent>
            </Dialog> */}
        </main>
    )
}