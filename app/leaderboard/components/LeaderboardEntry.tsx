import { Flame, Target, TrendingUp } from "lucide-react";

interface ILeaderboardEntryProps {
    currentPlace:number;
    username:string;
    rank: number;
    streak: number;
    accuracy: number;
    gamesPlayed: number;
}


const firstBG = 'bg-gradient-to-t from-orange-400/20 to-orange-400/5 border-orange-400/30 border border-b-0';


export default function LeaderboardEntry({currentPlace, username, rank, streak, accuracy, gamesPlayed}:ILeaderboardEntryProps) {


    return (
        <div className="flex justify-between pl-5 pr-5 pt-3 pb-3 border border-gray-500 rounded-lg mb-3 text-xs bg-card-bg hover:bg-card-bg-hover transition">
            {/* left content */}
            <div className="flex justify-center items-center gap-4">
                <p className="text-gray-500 text-base">{currentPlace}</p>
                <div>
                    <p className="text-white text-base mb-1">{username}</p>
                    <p className="text-gray-500 text-small">{gamesPlayed} Games</p>
                </div>
            </div>
            <div className="flex items-center justify-center gap-5">
                <div className="flex justify-center items-center gap-2">
                    <Flame size={20} className='text-orange-500'/>
                    <p className="text-white">10</p>
                </div>
                <div className="flex justify-center items-center gap-2">
                    <Target size={20} className='text-purple'/>
                    <p className="text-white">10</p>
                </div>
                <div className="flex justify-center items-center gap-2">
                    <TrendingUp size={20} className='text-teal'/>
                    <p className="text-white">10</p>
                </div>
            </div>
        </div>
    )
}