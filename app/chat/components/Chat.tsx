import { Bot, Send, User } from "lucide-react";
import Timer from "./Timer";

export default function Chat() {



    return (
        <main className="h-screen flex flex-col justify-between bg-bg-primary text-white">
            <Timer totalTime={10} onComplete={()=> null}/>
            <section className="h-full overflow-y-auto">
                <div className=" space-y-4 p-3 bg-teal">
                    {/* This is where you are going to render your messages.... */}
                    {Array.from({length: 25}).map((_, i) => (<p key={i}>foo bar {i}</p>))}
                </div>
            </section>
            <section className="p-3">
                <div className="flex justify-between mb-5">
                    <button className="border-2 border-teal hover:bg-teal hover:text-white transition cursor-pointer p-2 rounded w-full mr-1 text-teal outline-none">
                        <div className="flex items-center justify-center gap-2">
                            <Bot size={20}/>
                            It&apos;s a Bot
                        </div>
                    </button>
                    <button className="border-2 border-purple hover:bg-purple hover:text-white transition cursor-pointer p-2 rounded w-full text-purple outline-none text-center">
                        <div className="flex items-center justify-center gap-2">
                            <User size={20}/>
                            Not a Bot
                        </div>
                    </button>
                </div>
                <div className="flex flex-row">
                    <textarea placeholder="Type your message here..." className="focus:border-teal focus:outline-none w-full bg-card-bg text-black rounded outline-hidden text-white p-3 border-box resize-none border-2 transition mr-1" />
                    <button className="rounded bg-teal w-12 h-12 m-auto cursor-pointer"><Send className="m-auto"/></button>
                </div>
            </section>
        </main>
    )
}