import { GuessIdentityRequest } from '@/types/request.types';
import { Guess } from '@/types/server.types';
import axios from 'axios';


export async function connectToRoom():Promise<{roomId: string, userId: string}> {
    try {
        const connectionRequest = await axios.get('/api/room/join');
        return connectionRequest.data.data;
    } catch(error) {
        console.error("Error connecting to a chat room.", error);
        return {roomId: '', userId: ''};
    }
}



// this is just going to have the guess of the user.
export async function guessIdentity(roomId:string, userId:string, guess:Guess):Promise<void> {
    try {
        const payload:GuessIdentityRequest = {
            userId,
            guess
        };
        const dealBreakingResponse = await axios.post(`/api/room/${roomId}/identify`, payload);

        return dealBreakingResponse.data.data;
    } catch(error) {
        console.log('unable to guess identity of user...');
    }
}