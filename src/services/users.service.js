import { get, set, ref, query, equalTo, orderByChild, update, push } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = (handle) => {

  return get(query(ref(db, 'users'), orderByChild('handle'), equalTo(handle)));
};

export const createUserHandle = (handle, uid, email, firstName, lastName, photo, address, phone, role = 'user') => {
  return set(ref(db, `users/${handle}`), { 
    handle, 
    uid, 
    email, 
    firstName, 
    lastName, 
    photo, 
    address,
    phone, 
    createdOn: new Date(),
    role
  });
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const setAdminRole = async (handle) => {
  try {
    await update(ref(db, `users/${handle}`), { role: 'admin' });
  } catch (error) { console.error('Error setting admin role:', error); }
};

export async function updateUserEvents(handle, eventId, startDateTime, endDateTime, type) {
  try {
    await update(ref(db, `users/${handle}`), {
      [`events/${eventId}`]: {
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        attended: true,
        type: type
      }
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

export async function updateUserProfile(handle, firstName, lastName, phone, address, photo) {
  const userRef = ref(db, `users/${handle}`);

  const updates = {};
  if (firstName !== undefined && firstName !== null) updates.firstName = firstName;
  if (lastName !== undefined && lastName !== null) updates.lastName = lastName;
  if (phone !== undefined && phone !== null) updates.phone = phone;
  if (address !== undefined && address !== null) updates.address = address;
  if (photo !== undefined && photo !== null) updates.photo = photo;

  try {
      await update(userRef, updates);
      return { success: true };
    } catch (error) { console.error('Error updating user profile:', error); }

}

export async function addContactList(handle, listName, contacts) {
  try {
    const listRef = await push(ref(db, `users/${handle}/contactLists`));
    console.log(listName, contacts)
    const contactListData = {
      contacts: contacts,
      id: listRef.key,
      listName: listName,
      owner : handle 
    };

    await set(listRef, contactListData);

    console.log("Contact list successfully written with ID:", listRef.key);
    return listRef.key;
  } catch (error) {
    console.error('Error writing contact list:', error);
    throw error;
  }
}

export async function fetchContactLists(handle) {
  try {
    const contactListsRef = ref(db, `users/${handle}/contactLists`);
    const contactListsSnapshot = await get(contactListsRef);
    const contactListsData = [];

    contactListsSnapshot.forEach((contactListSnapshot) => {
      contactListsData.push({ name: contactListSnapshot.key, users: contactListSnapshot.val() });
    });

    return contactListsData;
  } catch (error) {
    console.error('Error fetching contact lists:', error);
    throw error;
  }
}