import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = (handle) => {

  return get(query(ref(db, 'users'), orderByChild('handle'), equalTo(handle)));
};

export const createUserHandle = (handle, uid, email, firstName, lastName, photo, address, role = 'user') => {
  return set(ref(db, `users/${handle}`), { 
    handle, 
    uid, 
    email, 
    firstName, 
    lastName, 
    photo, 
    address, 
    createdOn: new Date(),
    role
  });
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const setAdminRole = async (handle) => {
  await update(ref(db, `users/${handle}`), { role: 'admin' });
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
  const userRef = ref(db, `users/${handle}`);

  const updates = {};
  if (firstName !== undefined && firstName !== null) updates.firstName = firstName;
  if (lastName !== undefined && lastName !== null) updates.lastName = lastName;
  if (phone !== undefined && phone !== null) updates.phone = phone;
  if (address !== undefined && address !== null) updates.address = address;
  if (avatar !== undefined && avatar !== null) updates.avatar = avatar;

  await update(userRef, updates);

  return { success: true };
}

export async function addContactList(handle, listName, contacts) {
  try {
    const listRef = ref(db, `users/${handle}/contactLists/${listName}`);
    await set(listRef, contacts);
    console.log("Contact list successfully written!");
  } catch (error) {
    console.error('Error writing contact list:', error);
    throw error;
  }
}