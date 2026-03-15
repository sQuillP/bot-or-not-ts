import { ArrowLeft, Crown, Medal, Trophy } from "lucide-react";
import Link from "next/link";
import LeaderboardEntry from "./components/LeaderboardEntry";



export default function LeaderboardPage() {
    return (
        <main className="min-h-screen bg-bg-primary">
            <header className="flex flex-row  items-center justify-between p-10 w-[600px] m-auto">
                <div className="flex justify-between w-full items-center">
                    <Link href="/" className="flex justify-center items-center gap-3 hover:bg-gray-800 pl-2 pr-5 pt-1 pb-1 rounded hover:text-black transition">
                        <ArrowLeft size={20} className="text-gray-600"/>
                        <p className="text-gray-500">Back</p>
                    </Link>
                    <div className="flex justify-center gap-3 items-center">
                        <Trophy className="text-teal" size={25} />
                        <h1 className="text-2xl font-bold text-center text-white">Leaderboard</h1>
                    </div>
                    <div className="w-20"></div>
                </div>
                
                {/* Empty div for spacing */}
            </header>
            {/* Top three players */}
            <section>
                <div className="flex flex-row max-w-[450px] items-end m-auto gap-5">
                    <div className="w-full h-full">
                        <div className="flex justify-center flex-col items-center">
                            <Medal size={20} className="text-gray-400"/>
                            <p className="text-white">Second Place</p>
                        </div>
                        <div className="flex justify-center items-center bg-gradient-to-t from-muted-foreground/20 to-muted-foreground/5 border-muted-foreground/30 border border-b-0 h-[10vh] w-full border-2 rounded-t-lg">
                            <p className="font-mono text-2xl font-bold text-gray-600">#2</p>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex justify-center flex-col items-center">
                            <Crown size={20} className="text-yellow-500"/>
                            <p className="text-white">noob_pwner_1999</p>
                            {/* <p className="text-orange-400 font-bold">Any other info goes here</p> */}
                        </div>
                        <div className="flex justify-center items-center bg-gradient-to-t from-yellow-400/20 to-yellow-500/5 border-yellow-400/40 border border-b-0 h-[15vh] w-full border-2 rounded-t-lg">
                            <p className="font-mono text-2xl font-bold text-gray-600">#1</p>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex justify-center flex-col items-center">
                            <Medal size={20} className="text-orange-700"/>
                            <p className="text-white">Third Place</p>
                        </div>
                        <div className=" bg-gradient-to-t from-orange-400/20 to-orange-400/5 border-orange-400/30 border border-b-0  h-[6vh] w-full border-2 rounded-t-lg flex justify-center items-center">
                            <p className="font-mono text-2xl font-bold text-gray-600">#3</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Top 10 players */}
            <section className="pt-10 border-box pl-5 pr-5 max-w-[750px] m-auto">
                <LeaderboardEntry rank={3} username={'player1'} accuracy={3} currentPlace={1} gamesPlayed={123} streak={0}/>
                <LeaderboardEntry rank={5} username={'player2'} accuracy={3} currentPlace={1} gamesPlayed={123} streak={0}/>
                <LeaderboardEntry rank={6} username={'player3'} accuracy={3} currentPlace={1} gamesPlayed={123} streak={0}/>
            </section>

        </main>
    )
}