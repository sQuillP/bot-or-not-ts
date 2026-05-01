

export enum END_STATES  {
    PLAYER_GUESS_PLAYER = 'PLAYER_GUESS_PLAYER',
    PLAYER_GUESS_BOT = 'PLAYER_GUESS_BOT',
    PLAYER_TIMEOUT = 'PLAYER_TIMEOUT',
}

export interface JWTPayload {
    aud: string;
    role: string;
    email?:string;
    sub?:string;
    exp: number;    
}


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
        playerGuess?: END_STATES;
        guesserId?:string;
        playerTurn?: string;
    },
    restricted: {
        isBotRoom: boolean;
        lastMessageTimestamp: string;
        players: {
            [playerId:string]: PlayerData;
        },
        botId?:string;
    }
}

export interface User {
    id: string;
    email:string;
    win_count: number;
    lose_count:number;
    provider: string;
    guess_correct: number;
    guess_incorrect: number;
    total_games: number;
    name: string;
}


// client message


