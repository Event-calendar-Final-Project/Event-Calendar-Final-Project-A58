import { ref, push, get, set, update, child, remove } from 'firebase/database';
import { db } from '../config/firebase-config';

// Add a new event to the database
export const addEvent = async (author, name, description, date, location, /*photoUrl*/) => {
    const event = {
        author,
        name,
        description,
        date,
        location,
       // photoUrl,
        createdOn: Date.now(),
    };
    console.dir(event);
    const result = await push(ref(db, 'events'), event);
    return result.key;
};

// Get all events, optionally filtered by search term
export const getAllEvents = async (search) => {
    const eventsSnapshot = await get(ref(db, 'events'));

    let events = {};

    if (eventsSnapshot.exists()) {
        events = eventsSnapshot.val();
    }

    let tagEvents = {};


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
        || (e.author === search) || tagEvents[e.id]);
};

// Get event by ID
export const getEventById = async (id) => {
    const snapshot = await get(ref(db, `events/${id}`));

    if (!snapshot.val()) throw new Error('Event with this ID does not exist!');

    return {
        ...snapshot.val(),
        id,
        likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
        createdOn: new Date(snapshot.val().createdOn).toString(),
    }
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
    const snapshot = await get(ref(db, 'events'));
    if (!snapshot.exists()) return [];

    return Object.entries(snapshot.val());
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

// Fetch an event from the database by ID
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

export const inviteUser = async (eventId, userId) => {
    const eventRef = ref(db, `events/${eventId}/invitedUsers/${userId}`);
    await set(eventRef, true);
};

export const disinviteUser = async (eventId, userId) => {
    const eventRef = ref(db, `events/${eventId}/invitedUsers/${userId}`);
    await remove(eventRef);
};