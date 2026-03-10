import useTimer from "@/hooks/useTimer";
import { Clock } from "lucide-react";
import { JSX, useState } from "react"


interface ITimerProps {
    totalTime: number;
    onComplete: () => void;
}


const defaultTime:number = 25;


export default function Timer({totalTime, onComplete}:ITimerProps):JSX.Element {

    const timerData = useTimer({totalTime: defaultTime, direction: 'forward'});
    console.log(timerData);
    const width = `${(timerData.remainingTime / defaultTime) * 100}%`;
    return (
        <div className="mb-10">
            <div>
                <p>Mystery Partner</p>
                <div className="bg-red-500 flex flex-row"><Clock/> <span>{totalTime - timerData.remainingTime}</span></div>
            </div>
            <div>
                <div style={{width}} className="bg-teal h-1 transition-all rounded ease-linear">
                </div>
            </div>
        </div>
    )
}