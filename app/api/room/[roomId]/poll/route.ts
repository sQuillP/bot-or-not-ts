import { NextRequest, NextResponse } from "next/server";
import database from '@/lib/firebaseAdmin';
import { ChatRoom } from "@/types/server.types";

const MAX_CAPACITY = 2;

async function fillRoomWithBot(roomId:string):Promise<boolean> {

    const botId = crypto.randomUUID().toString();
    const roomRef = await database.ref(`chat/rooms/${roomId}`)
        //If the item exists, run transaction 
        const connected = await roomRef.transaction((roomInfo):(ChatRoom | undefined | null)=> {
            
            if(roomInfo === null)  return roomInfo
            // Cancel transaction if room is full or the game is already finished.
            if(!roomInfo || roomInfo.occupancy >= MAX_CAPACITY || roomInfo.public?.gameFinished) return;



            // User should go first.
            const firstTurnPlayer:string = Object.keys(roomInfo.restricted.players)[0];


            return {
                ...roomInfo,
                public: {
                    ...roomInfo.public,
                    occupancy: roomInfo.public.occupancy + 1,
                    gameReady: true,
                    playerTurn: firstTurnPlayer
                },
                restricted: {
                    ...roomInfo.restricted,
                    lastMessageTimestamp: new Date().toISOString(),
                    players: {
                        ...(roomInfo.restricted.players || {}),
                        [botId]: {
                            joined: new Date().toISOString(),
                        }
                    },
                    botId,
                    isBotRoom: true
                },
                
            };
        });

        return connected.committed;
}




/**
 * We need to figure out a probability
 * whether or not it's time to fill room with a bot.
 * 
 * TODO: 
 * PROTECT THIS ROUTE
 * @param _ 
 * @param param1 
 * @returns 
 */
const PROBABILITY_OF_BOT = 0.75;

export async function GET(_:NextRequest, 
    {params}:{params: Promise<{roomId:string}>}
): Promise<NextResponse> {

    const {roomId} = await params;

    if(Math.random() < 3) {
        console.log('decided to fill room with a bot. Room id: ', roomId);
        await fillRoomWithBot(roomId);
        console.log("room is now filled with a bot...");
    }


    return NextResponse.json({data:'awaiting player...'}, {status: 200});
}