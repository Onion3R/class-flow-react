// import { db } from './firebase'; // your firestore instance
// import { collection, doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
// import { nanoid } from 'nanoid'; // install with npm i nanoid

// export const generateInviteLink = async (role) => {
//   const token = nanoid(32); // short and unique
//   const expiresAt = Timestamp.fromDate(new Date(Date.now() + 30 * 60 * 1000)); // 30 mins

//   await setDoc(doc(collection(db, 'invites'), token), {
//     role,
//     expiresAt,
//     createdAt: serverTimestamp(),
//   });

//   return `${window.location.origin}/invite?token=${token}`;
// };
