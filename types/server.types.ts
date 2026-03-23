

// Message contract for a room.
export interface RoomMessage {
    created: number; // timestamp
    from: string;
    message: string;
}

export type Guess = 'Bot' | 'Human';

export interface PlayerData {
    joined: string;
}


// Individual rooms for the app.
export interface ChatRoom {
    public: {
        messages?: {[messageId:string]:RoomMessage},
        occupancy: number;
        gameFinished: boolean;
        winner?: string;
        gameReady: boolean;
        currentTurn: string;
    },
    restricted: {
        isBotRoom: boolean;
        lastMessageTimestamp: string;
        players: {
            [playerId:string]: PlayerData;
        }
    }
}




// client message


