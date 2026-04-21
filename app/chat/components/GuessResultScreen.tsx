import { CircleCheckBig, CircleX } from "lucide-react";
import { JSX } from "react";
import Link from "next/link";
import { END_STATES } from "@/types/server.types";

interface IGuessResultScreenProps {
    winner: boolean;
    reason: END_STATES;
    guesserId: string | undefined;
    userId: string | undefined;
}



/**
 * @description - pass in whether the other player has won. also pass in the verdict that a player
 * has chosen. 
 */
export default function GuessResultScreen({ winner = true, reason = END_STATES.PLAYER_GUESS_BOT, guesserId, userId }: IGuessResultScreenProps): JSX.Element {
    return (
        <main className="bg-bg-primary h-full flex items-center justify-center p-6">
            <section className="text-center max-w-md w-full">
                {(() => {
                    // Shared styles for icons and text

                    console.log({winner, reason, guesserId, userId});
                    const iconClasses = "m-auto mb-6";
                    const iconSize = 60;
                    const textClasses = "text-gray-400 text-2xl mb-8 leading-relaxed";

                    if (winner && reason === END_STATES.PLAYER_GUESS_BOT && guesserId === userId) {
                        return (
                            <>
                                <CircleCheckBig size={iconSize} className={`${iconClasses} text-green-400`} />
                                <p className={textClasses}>You have correctly identified the other player as a bot.</p>
                            </>
                        );
                    } 

                     if (winner && reason === END_STATES.PLAYER_GUESS_BOT && guesserId !== userId) {
                        return (
                            <>
                                <CircleCheckBig size={iconSize} className={`${iconClasses} text-green-400`} />
                                <p className={textClasses}>The other player thought you were a bot</p>
                            </>
                        );
                    } 
                    
                    if (!winner && reason === END_STATES.PLAYER_GUESS_BOT && guesserId === userId) {
                        return (
                            <>
                                <CircleX size={iconSize} className={`${iconClasses} text-red-400`} />
                                <p className={textClasses}>
                                    You guessed <span className="text-white font-bold">Bot</span>. It was actually a <span className="text-purple font-bold">Human</span>.
                                </p>
                            </>
                        );
                    } 
                    
                    if (winner && reason === END_STATES.PLAYER_GUESS_PLAYER && guesserId === userId) {
                        return (
                            <>
                                <CircleCheckBig size={iconSize} className={`${iconClasses} text-green-400`} />
                                <p className={textClasses}>
                                    Looks like you guessed correctly.<br />
                                    <span className="text-lg opacity-80">You blew their cover!</span>
                                </p>
                            </>
                        );
                    } 

                    if (!winner && reason === END_STATES.PLAYER_GUESS_PLAYER && guesserId !== userId) {
                        return (
                            <>
                                <CircleX size={iconSize} className={`${iconClasses} text-red-400`} />
                                <p className={textClasses}>Looks like the other figured out your identity...</p>
                            </>
                        );
                    }

                    if(!winner && reason === END_STATES.PLAYER_GUESS_PLAYER && guesserId === userId) {
                        return (
                            <>
                                <CircleX size={iconSize} className={`${iconClasses} text-red-400`} />
                                <p className={textClasses}>You have guessed incorrectly. Turns out they were a BOT!</p>
                            </>
                        )
                    }
                    
                    return null;
                })()}

                <Link
                    className="text-bg-primary block py-3 font-bold w-full rounded-lg bg-teal cursor-pointer text-center hover:bg-teal-hov transition-colors"
                    href="/"
                >
                    Back to home
                </Link>
            </section>
        </main>
    );
}
