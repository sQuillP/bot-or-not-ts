import useTimer from "@/hooks/useTimer";
import { Clock, Power } from "lucide-react";
import { JSX} from "react"


interface ITimerProps {
    totalTime: number;
    onComplete: () => void;
    onTriggerDisconnect: () => void;
}


export default function ChatHeader({totalTime, onComplete, onTriggerDisconnect: onDisconnect}:ITimerProps):JSX.Element {

    const timerData = useTimer({totalTime: totalTime});
    const width = `${(timerData.count / totalTime) * 100}%`;

    return (
        <div className="mb-10">
            <div className="flex justify-between items-center p-4">
                <div className="flex justify-center items-center gap-2">
                    <button onClick={onDisconnect} className='rounded-full border border-gray-500 bg-gray-800 flex items-center justify-center p-2 cursor-pointer transition hover:bg-gray-700'>
                        <Power size={20} className="text-gray-500 inline-block"/>
                    </button>
                    <p className="text-gray-400"> Awaiting response from partner...</p>
                </div>

                <div className="flex flex-row justify-end">

                    <div style={{background: 'rgba(214, 54, 54, 0.15)'}} className="flex flex-row pt-1 pb-1 pl-4 pr-4 rounded rounded-xl gap-2 items-center">
                        <Clock size={20} style={{color: '#d63636'}}/> 
                        <span style={{color: '#d63636'}}>00:{(totalTime - timerData.count).toString().padStart(2, '0')}</span>
                    </div>
                </div>
            </div>
            <div className="pl-4 pr-4">
                <div style={{width}} className="bg-teal h-1 transition-all rounded ease-linear"/>
            </div>
        </div>
    )
}