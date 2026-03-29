import { Guess } from "./server.types";


export interface GuessIdentityRequest {
    userId: string;
    guess: Guess;
}