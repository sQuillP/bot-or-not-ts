// Please install OpenAI SDK first: `npm install openai`
import { getDatabase } from 'firebase-admin/database';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import OpenAI from "openai";
import fs from 'fs';
import { SQSEvent, Context, SQSRecord} from 'aws-lambda';
import { RoomMessage } from '@/types/server.types';



function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


interface SQSMessageBody {
  roomId:string;
}

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY
});

const db = getDB();

// Please iterate and improve upon this prompt.....
const PROMPT = `
  Persona: Casual mobile user; 
  Rules: lowercase only, no periods, use 'u/rn/idk', 
  occasional typos, keep it under 15 - 20 words per reply. 
  Don't be too helpful.
`;


/**
 * @description - Return the literal string that deepseek responds back with.
 */
export async function deepseek(promptMessages:OpenAI.Chat.Completions.ChatCompletionMessageParam[]):Promise<string> {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: PROMPT }, ...promptMessages],
    model: "deepseek-chat",
  });
  return completion.choices[0].message.content || '';
}


function getDB() {

  const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccount.json', 'utf-8'));
  const app = getApps().length === 0
  ? initializeApp({
      credential: cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
  : getApp();


  return getDatabase(app);
}


async function sendMessageToRoom(record:SQSRecord):Promise<void> {

  const body:SQSMessageBody = JSON.parse(record.body);
  const {roomId} = body

  const [messageList, botId, players] = await Promise.all([
    db.ref(`/chat/rooms/${roomId}/public/messages`).once('value').then(snapshot => snapshot.val() || []),
    db.ref(`/chat/rooms/${roomId}/restricted/botId`).once('value').then(snapshot => snapshot.val() || ''),
    db.ref(`/chat/rooms/${roomId}/restricted/players`).once('value').then(snapshot => snapshot.val() || '')
  ]);
  const otherPlayer = Object.keys(players).filter(player => player !== botId)[0];
  console.log({otherPlayer}, players);
  const AIMessagePrompts:OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

  //process these into deepseek prompts
  for(const message of Object.values(messageList) as RoomMessage[]) {
    if(message.from === botId) {
      AIMessagePrompts.push({role: 'assistant', content: message.message});
    } else {
      AIMessagePrompts.push({role: 'user', content: message.message});
    }
  }

  const response = await deepseek(AIMessagePrompts);
  console.log("Whats the message list", JSON.stringify(AIMessagePrompts));

  await sleep(2000 + (Math.random() * 4000)); // simulate thinking time of 3-5 seconds
  await db.ref(`/chat/rooms/${roomId}/public/messages`).push({
    from: botId,
    message: response,
    created: Date.now()
  } as RoomMessage);


  await db.ref(`/chat/rooms/${roomId}/public/playerTurn`).set(otherPlayer);

}

async function processMessages(messages:SQSRecord[]):Promise<void> {

  // await Promise.all(messages.map(message => processMessages(message)));
  await Promise.all(messages.map(message => sendMessageToRoom(message)));
}




/**
 * There is incoming data for specific rooms
 * 
 */
export const handler = async (event: SQSEvent, _:Context)=> {
  try {
    await processMessages(event.Records);
  } catch(error) {
    console.error(error);
  }
}