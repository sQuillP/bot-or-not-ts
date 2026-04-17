import serviceAccount from '../app/certs/bot-or-not-493301-firebase-adminsdk-fbsvc-cbaf6fee62.json'
import { getDatabase } from 'firebase-admin/database';
import { initializeApp, cert, getApps, getApp, ServiceAccount } from 'firebase-admin/app';


const app = getApps().length === 0
  ? initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
  : getApp();


const db = getDatabase(app);

export default db;