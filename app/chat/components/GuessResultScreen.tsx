import { CircleCheckBig, CircleX } from "lucide-react";
import { JSX } from "react";
import Link from "next/link";

interface IGuessResultScreenProps {
    correct: boolean;
}

enum END_STATES  {
    PLAYER_GUESS_PLAYER,
    PLAYER_GUESS_BOT,
}


const chance = Math.floor(Math.random()*2);

export default function GuessResultScreen({correct}:IGuessResultScreenProps):JSX.Element {

    console.log(chance);
    return  (
        <main className="bg-bg-primary text-gray-400 h-full flex items-center justify-center">
            <section className="text-center">
                {
                    (()=> {

                        if(chance === 1) {
                           return (
                                 <>
                                    <CircleCheckBig size={60} className="m-auto mb-6 text-green-400"/>
                                    <p className="text-gray-400 text-2xl mb-8">You have correctly guessed the players identity!</p>
                                </>
                           )
                        }
                        
                        return (
                            <>
                                <CircleX size={60} className="m-auto mb-6 text-red-400"/>
                                <p className="text-gray-400 text-2xl mb-8">You guessed <span className="text-white font-bold">Bot</span>. It was actually a <span className="text-purple font-bold">Human</span></p>
                            </>
                        )
                    })()
                }
                {/* Maybe mention that they have lost rank.... */}
                <Link
                    className="text-bg-primary block py-3  font-bold w-full rounded-lg bg-teal cursor-pointer text-center hover:bg-teal-hov transition" 
                    href="/"
                >
                    Back to home
                </Link>
            </section>
        </main>
    )
}