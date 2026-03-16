import axios, { AxiosResponse } from 'axios';


export async function connectToRoom():Promise<AxiosResponse['data']> {
    try {
        const connectionRequest = await axios.get('/api/room/join');
        return connectionRequest.data;
    } catch(error) {
        console.error("Error connecting to a chat room.", error);
    }
}