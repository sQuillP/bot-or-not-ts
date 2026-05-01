import { NextRequest, NextResponse } from "next/server";
import firebase from '@/lib/firebaseAdmin';
import { GuessIdentityRequest } from "@/types/request.types";
import { END_STATES } from "@/types/server.types";
import { supabaseAdmin } from "@/lib/supabase";


const MIN_MESSAGES_BEFORE_GUESS = -1;


/**
 * @description - Makes sure that user is a member, and that the game is not already finished. Also checks to see if there are enough messages to make a guess.
 * If all of these conditions are satisfied, then the user can make a guess and update the game state accordingly.
 * @param roomId 
 * @param body 
 * @returns 
 */
export async function guardRoom(roomId:string, body:GuessIdentityRequest):Promise<boolean> {
    const [membership, gameFinished] = await Promise.all([
        firebase.ref(`/chat/rooms/${roomId}/restricted/players/${body.userId}`).once('value'),
        firebase.ref(`/chat/rooms/${roomId}/public/gameFinished`).once('value'),
    ]);

    if(membership.exists() === false) {
        console.log("user is not a member of this room. Cannot make guess.");
        return false;
    }
    if(gameFinished.val() === true) {
        console.log("game is already finished. Nothing more can be done in this room.")
        return false;
    }

    const messageReads = await firebase.ref(`/chat/rooms/${roomId}/public/messages`).once('value');
    const messageList:number = Object.keys(messageReads.val() || {}).length;

    if(messageList <= MIN_MESSAGES_BEFORE_GUESS) {
        console.log('Not enough messages to make a guess. Messages so far: ', messageList);
        return false;
    }

    return true;
}


/**
 * @description - 
 * @param request 
 * @param param1 
 * @returns 
 */
export async function POST(
    request:NextRequest,
    {params}:{params: Promise<{roomId:string}>}
):Promise<NextResponse> {
    try {

        const body:GuessIdentityRequest = await request.json();
        const {roomId} = await params;

        const validRequest = await guardRoom(roomId, body);
        if(validRequest === false) {
            return NextResponse.json({data: 'Insufficient conditions for guessing in this room.'}, {status: 400});
        }


        // grab room resources to determine if guess is correct, then update the game state accordingly.
        const isBotRoom = await firebase.ref(`/chat/rooms/${roomId}/restricted/isBotRoom`).once('value');
        const playerIds = Object.keys((await firebase.ref(`/chat/rooms/${roomId}/restricted/players`).once('value')).val());
        const otherPlayer = playerIds.filter(id => id !== body.userId)[0];

        // assume winner is the guesser, and then flip if the guess is wrong.
        let winnerId:string = body.userId;
        let loserId:string = otherPlayer;
        const endState = body.guess === 'Bot' ? END_STATES.PLAYER_GUESS_BOT : END_STATES.PLAYER_GUESS_PLAYER;

        if(isBotRoom.val() !== true && body.guess === 'Bot') {
            // user guessed bot, but it was a human room. User loses.
            winnerId = otherPlayer;
            loserId = body.userId;
        } else if(isBotRoom.val() === true && body.guess === 'Human') {
            winnerId = otherPlayer;
            loserId = body.userId;
        }else if(isBotRoom.val() === false && body.guess === 'Bot') {
            loserId = body.userId;
            winnerId = otherPlayer;
        } else if (isBotRoom.val() === false && body.guess === 'Human') {
            loserId = otherPlayer;
            winnerId = body.userId;
        }
        //TODO: just have player send end state and forget this thing.

        const guess = firebase.ref(`/chat/rooms/${roomId}/public/playerGuess`).set(endState);
        const lock = firebase.ref(`/chat/rooms/${roomId}/public/gameFinished`).set(true);
        const winner = firebase.ref(`/chat/rooms/${roomId}/public/winner`).set(winnerId);
        const guesser = firebase.ref(`/chat/rooms/${roomId}/public/guesserId`).set(body.userId);

        await Promise.all([guess, lock, winner, guesser]);


        // grab the logged in users details from the chat room.
        const users = await firebase.ref(`/chat/rooms/${roomId}/restricted/players`).once('value');

        console.log("what are the users::: ", users.val());
        const winQuery =  supabaseAdmin.from('users').select('win_count').eq('id', winnerId);
        const loseQuery = supabaseAdmin.from('users').select('lose_count').eq('id', loserId)
        const [winResult, loseResult] = await Promise.all([winQuery, loseQuery]);
        console.log("whats the win result", winResult, loseResult);
        
        let winWrite, loseWrite;
        if(winResult.data && winResult.data.length > 0) {
             winWrite = supabaseAdmin.from('users').update({win_count: winResult.data[0].win_count + 1}).eq('id', winnerId);
        }
        if(loseResult.data && loseResult.data.length > 0) {
             loseWrite = supabaseAdmin.from('users').update({lose_count: loseResult.data[0].lose_count + 1}).eq('id', loserId);
        } 

        await Promise.all([winWrite, loseWrite]);

        

        return NextResponse.json({data: 'ok'}, {status: 200});
    } catch(error) {
        console.error('error guessing player identity: ',error);
        return NextResponse.json({data: 'Unable to process guess at this time.'}, {status: 500});
    }
}