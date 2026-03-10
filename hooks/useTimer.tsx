import { useEffect, useRef, useState } from "react";

interface IUseTimerReturn {
    count: number;
    completed: boolean;
}


interface IUseTimerProps {
    totalTime: number;
}


/**
 * Counts down to a certain time and then returns whether or not the timer
 * has completed or not.
 */
export default function useTimer({
    totalTime, 
}: IUseTimerProps): IUseTimerReturn {

    const [passedTime, setPassedTime] = useState<number>(0);
    const interval = useRef<NodeJS.Timeout | null>(null);
    
    useEffect(()=> {
        if(passedTime < totalTime) return;
        if(interval.current){
            clearInterval(interval.current);
            console.log('time is up!');
            interval.current = null;
        }
    }, [passedTime, totalTime]);

    useEffect(()=> {

        interval.current = setInterval(() => {
            setPassedTime((prev) => prev + 1);
        }, 1000); 

        return () => {
            if(interval.current) {
                clearInterval(interval.current);
                interval.current = null;
            }
        }
    },[totalTime]);

    return {
        count: direction === 'backward' ? totalTime - passedTime : passedTime,
        completed: passedTime >= totalTime,
    }
}