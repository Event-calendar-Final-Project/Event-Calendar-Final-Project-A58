import { ref, push, get, set, update, child, remove } from 'firebase/database';
import { db } from '../config/firebase-config';

// Add a new event to the database
export const addEvent = async (author, name, description, startDateTime, endDateTime, location, photo, type) => {
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
};

// Get all events, optionally filtered by search term
export const getAllEvents = async (search) => {
    const eventsSnapshot = await get(ref(db, 'events'));

    let events = {};

    if (eventsSnapshot.exists()) {
        events = eventsSnapshot.val();
    }

    // Fetch event series
    const eventSeriesSnapshot = await get(ref(db, 'eventSeries'));

    if (eventSeriesSnapshot.exists()) {
        const eventSeries = eventSeriesSnapshot.val();
        
        // Fetch events for each series and merge with existing events
        for (const seriesId in eventSeries) {
            const seriesEventsSnapshot = await get(ref(db, `eventSeries/${seriesId}/events`));
            if (seriesEventsSnapshot.exists()) {
                console.log(seriesEventsSnapshot.val());
                const seriesEvents = seriesEventsSnapshot.val();
                events = { ...events, ...seriesEvents };
            }
        }
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

// Invite a user to an event
export const inviteUser = async (eventId, userHandle) => {
    const event = await getEventById(eventId);
    const updateVal = {};
    if (!event.invitedUsers) {
        event.invitedUsers = {}; // Initialize invitedUsers if it doesn't exist
    }

    if (event.invitedUsers[userHandle] === false) {
        return;
    }
    updateVal[`events/${eventId}/invitedUsers/${userHandle}`] = true;
    update(ref(db), updateVal);
};

// Disinvite a user from an event
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
