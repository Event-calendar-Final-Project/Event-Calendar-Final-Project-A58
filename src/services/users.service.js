import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = (handle) => {

  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (handle, uid, email) => {

  return set(ref(db, `users/${handle}`), { handle, uid, email, createdOn: new Date() })
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export async function updateUserEvents(handle, eventId) {
  try {
    await update(ref(db, `users/${handle}`), {
      [`events/${eventId}`]: true
    });
  } catch (error) {
    console.error("Error updating user events:", error);
    throw error;
  }
}