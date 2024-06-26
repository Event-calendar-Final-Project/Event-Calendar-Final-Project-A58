import { ref, push, get, set, update, child, remove } from 'firebase/database';
import { db } from '../config/firebase-config';

export const addEvent = async (author, name, description, startDateTime, endDateTime, location, photo, type) => {
    try {
        const event = {
            author,
            name,
            description,
            startDateTime: startDateTime.toISOString(),
            endDateTime: endDateTime.toISOString(),
            location,
            photo,
            type,
            createdOn: Date.now(),
        };
        console.dir(event);
        const result = await push(ref(db, 'events'), event);
        return result.key;
    } catch (error) { console.error('Error adding event:', error); }
};


export const getAllEvents = async (search) => {
    try {
        const eventsSnapshot = await get(ref(db, 'events'));

        let events = {};

        if (eventsSnapshot.exists()) {
            events = eventsSnapshot.val();
        }


        return Object
            .entries(events)
            .map(([key, value]) => {
                return {
                    ...value,
                    id: key,
                    likedBy: value.likedBy ? Object.keys(value.likedBy) : [],
                    createdOn: new Date(value.createdOn).toString(),
                }
            })
            .filter(e => (e.description.toLowerCase().includes(search.toLowerCase())) || (e.name.toLowerCase().includes(search.toLowerCase()))
            || (e.author === search));
    } catch (error) { console.error('Error fetching events:', error); }
};


export const getEventById = async (id) => {
    try {
        const snapshot = await get(ref(db, `events/${id}`));
        if (!snapshot.exists()) {
            throw new Error('Event with this ID does not exist!');
        }

        return {
            ...snapshot.val(),
            id,
            likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
            createdOn: new Date(snapshot.val().createdOn).toString(),
        };
    } catch (error) { console.error('Error fetching event by ID:', error); }
};

// Like an event
export const likeEvent = async (eventId, handle) => {
    const updateVal = {};
    updateVal[`users/${handle}/likedEvents/${eventId}`] = true;
    updateVal[`events/${eventId}/likedBy/${handle}`] = true;

    update(ref(db), updateVal);
};

// Dislike an event
export const dislikeEvent = async (eventId, handle) => {
    const updateVal = {};
    updateVal[`users/${handle}/likedEvents/${eventId}`] = null;
    updateVal[`events/${eventId}/likedBy/${handle}`] = null;

    update(ref(db), updateVal);
};



// Get all events without any filtering
export const getEvents = async () => {
    try {
        const snapshot = await get(ref(db, 'events'));
        if (!snapshot.exists()) return [];

        return Object.entries(snapshot.val());
    } catch (error) { console.error('Error fetching events:', error); }
};


// Update an event
export const updateEvent = async (eventId, updatedEventData) => {
    const eventRef = ref(db, `events/${eventId}`);
    try {
        await set(eventRef, updatedEventData); 
        console.log("Event updated successfully");
    } catch (error) {
        console.error("Error updating event:", error);
        throw error;
    }
};





// Delete an event
export async function deleteEventInDB(id, author) {
    try {
        await remove(ref(db, `events/${id}`));
        
        const usersRef = ref(db, 'users');
        const userSnapshot = await get(child(usersRef, author)); 

        if (userSnapshot.exists()) {
            const user = userSnapshot.val();

            if (user.events && user.events[id]) {
                await remove(ref(db, `users/${author}/events/${id}`)); 
            }
        }
    } catch (error) {
        console.error('Error deleting event in DB:', error);
        throw error;
    }
}


export async function fetchEventFromDB(id) {
    const snapshot = await get(ref(db, `events/${id}`));
    const val = snapshot.val();
    if (val) {
        const authorSnapshot = await get(child(ref(db, 'users'), val.author));
        const author = authorSnapshot.val();

        return {
            ...val,
            id,
            author: author.handle, 
            likedBy: val.likedBy ? Object.keys(val.likedBy) : [],
            createdOn: new Date(val.createdOn).toString(),
        };
    } else {
        return null;
    }
}


export const inviteUser = async (eventId, userHandle) => {
    const event = await getEventById(eventId);
    const updateVal = {};
    if (!event.invitedUsers) {
        event.invitedUsers = {};
    }

    if (event.invitedUsers[userHandle] === false) {
        return;
    }
    updateVal[`events/${eventId}/invitedUsers/${userHandle}`] = true;
    update(ref(db), updateVal);
};


export const disinviteUser = async (eventId, userHandle) => {
    const updateVal = {};
    updateVal[`events/${eventId}/invitedUsers/${userHandle}`] = null;
    update(ref(db), updateVal);
};

export const getMyEvents = async (handle) => {
    const snapshot = await get(ref(db, `users/${handle}/events`));
    if (!snapshot.exists()) return [];

    return Object.entries(snapshot.val());
}

export const getInvitedUsers = async (eventId) => {
    const snapshot = await get(ref(db, `events/${eventId}/invitedUsers`));
    if (!snapshot.exists()) return [];

    return Object.keys(snapshot.val());
}

// Check if an event exists in the database
export const checkEventExists = async (name, startDate) => {
    const eventsSnapshot = await get(ref(db, 'events'));
    if (!eventsSnapshot.exists()) return false;

    const events = eventsSnapshot.val();
    for (const key in events) {
        if (events[key].name === name && events[key].startDate === startDate) {
            return true;
        }
    }
    return false;
};
