import { NextRequest, NextResponse } from "next/server";
import database from '@/lib/firebaseAdmin';
import crypto from 'crypto'
import { ChatRoom } from "@/types/server.types";




// Create a single room in firebase db.
async function createRoom():Promise<string> {
     const roomRef = await database.ref('chat/rooms');
    const generatedUserID = crypto.randomUUID();

    const chatRoomData:ChatRoom = {
        public: {
            messages: {},
            occupancy: 1,
            gameFinished: false,
            winner: '',
            gameReady: false
        },
        restricted: {
            isBotRoom: true,
            players: {
                [generatedUserID]: {
                    // more player infomration here
                    joined: Date.now()
                }
            }
        }
    };

    const refId = await roomRef.push(chatRoomData);
    if(refId.key === null) {
        throw new Error('Unable to generate key for room');
    }

    return refId.key
}


async function listRooms(): Promise<Record<string, ChatRoom> | null> {
    const rooms = database.ref('chat/rooms');
    const snapshot = await rooms.orderByChild('public/occupancy')
    .endAt(1)
    .once('value');
    const roomList:Record<string, ChatRoom> = snapshot.val();
    return roomList
}


// Returns true if a connection has been made to a specific room.
// THis means that the room is available to share for a specific user now.
async function establishConnection(roomId:string, userId:string):Promise<boolean> {
    try {
        const roomRef = await database.ref(`chat/rooms/${roomId}`)

        //If the item exists, run transaction 
        const connected = await roomRef.transaction((roomInfo):ChatRoom | undefined | null=> {
            if(roomInfo === null)  return roomInfo
            // Cancel transaction if room is full.
            if(!roomInfo || roomInfo.occupancy >= 2) return;

            return {
                ...roomInfo,
                public: {
                    ...roomInfo.public,
                    occupancy: roomInfo.public.occupancy + 1
                },
                restricted: {
                    ...roomInfo.restricted,
                    players: {
                        ...(roomInfo.restricted.players || {}),
                        [userId]: {
                            joined: new Date(),
                        }
                    }
                }
            };
        });

        return connected.committed;

    } catch(error) {
        console.log(error);
        return false;
    }
}



/**
 * @description Lists all the available rooms, then attempts to connect to the first
 * available room. If that connection is successful, then return that room ID immediately
 * otherwise, keep searching.
 * @returns 
 */
async function connectUserToRoom(userId:string):Promise<string> {
    const roomObject = await listRooms();
    if(roomObject === null) {
        return '';
    }
    for(const room of Object.keys(roomObject)) {
        if(await establishConnection(room, userId)) {
            return room;
        }
    }
    return '';
}




/**
 * @description returns a valid room ID to the consumer, this will be used as reference
 * to the current public chat room data. website can now connect to the room and see all the 
 * chats.
 * @param _ 
 * @returns 
 */
export async function GET(_:NextRequest):Promise<NextResponse> {

    // Room is initialized now,
    try {
        const userId = crypto.randomUUID();
        let roomId = await connectUserToRoom(userId);

        if(roomId === '')  {
            console.log("no rooms found, creating a new room...");
            roomId = await createRoom();
        }


        return NextResponse.json({data: {roomId: roomId, userId: crypto.randomUUID()}}, {status: 200});
    } catch(error) {
        console.error(error);
        return NextResponse.json({data:'Cannot find a room to join =('}, {status:500})
    }
}