import {acc} from "./cutshort-backend-firebase"
import admin from "firebase-admin";
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(acc as any)
});
export const store = admin.firestore();

