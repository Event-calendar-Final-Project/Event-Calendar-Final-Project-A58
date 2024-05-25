import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = (handle) => {

  return get(query(ref(db, 'users'), orderByChild('handle'), equalTo(handle)));
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

export async function getUserContactsList(handle) {
  try {
    const userContacts = await get(ref(db, `users/${handle}/contacts`));
    return userContacts.val();
  } catch (error) {
    console.error("Error getting user contacts:", error);
    throw error;
  }
}

export async function addContactToUser(handle, uid) {
  try {
    await update(ref(db, `users/${handle}/contacts`), {
      [uid]: true
    });
  } catch (error) {
    console.error("Error adding contact to user:", error);
    throw error;
  }
}

export async function fetchUsersFromDB() {
  try {
    const usersRef = ref(db, 'users');
    const usersSnapshot = await get(usersRef);
    const usersData = [];

    usersSnapshot.forEach((userSnapshot) => {
      usersData.push(userSnapshot.val());
    });

    return usersData;
  } catch (error) {
    console.error('Error fetching users from DB:', error);
    throw error;
  }
}

export async function fetchUserByHandle(handle){
  try {
    const userRef = ref(db, `users/${handle}`);
    const userSnapshot = await get(userRef);
    return userSnapshot.val();
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
}

export async function updateUserProfile(handle, firstName, lastName, phone, address, avatar) {
  const userRef = ref(db, 'users/' + handle);
  await update(userRef, {
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    address: address,
    avatar: avatar,
  });

  return { success: true };
}