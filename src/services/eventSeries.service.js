import { db } from "../config/firebase-config";
import { ref, set, get, push } from "firebase/database";

// Function to add an event series
export const addEventSeries = async (createdBy, title, description, endDate, repeat) => {
    const newSeriesRef = push(ref(db, 'eventSeries')); // Generate a new series ID
    const seriesId = newSeriesRef.key;

    const series = {
        createdBy,
        title,
        description,
        endDate,
        repeat,
        createdOn: Date.now(),
    };

    await set(newSeriesRef, series);
    return seriesId; // Return the generated series ID
};


export const addEventToSeriesById = async (seriesId, author, name, description, startDateTime, endDateTime, location, photo, type) => {

    const newEventRef = push(ref(db, 'events'));
    const eventId = newEventRef.key;

    
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

    
    await set(newEventRef, event);

    
    const seriesEventRef = ref(db, `eventSeries/${seriesId}/events/${eventId}`);
    await set(seriesEventRef, true);

    return eventId;
};


const generateRecurringEvents = async (seriesId, originalEventId, name, description, startDate, endDate, repeat) => {
    const eventsRef = ref(db, `eventSeries/${seriesId}/events`);
    const occurrences = [];
    let currentDate = new Date(startDate);

    while (!endDate || currentDate <= endDate) {
        occurrences.push(new Date(currentDate));
        if (repeat === 'weekly') {
            currentDate.setDate(currentDate.getDate() + 7);
        } else if (repeat === 'monthly') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else if (repeat === 'yearly') {
            currentDate.setFullYear(currentDate.getFullYear() + 1);
        }
    }

    for (const date of occurrences) {
        const newEventRef = push(eventsRef);
        const eventId = newEventRef.key;
        const event = {
            name,
            description,
            startDate: date.toISOString(),
            repeat: 'none', // Future occurrences are not repeating
            createdOn: Date.now(),
            originalEventId: originalEventId, // To keep track of the original event
        };
        await set(newEventRef, event);
    }
};

// Fetch an event series along with its events
export async function getEventSeries(seriesTitle) {
    const seriesRef = ref(db, 'eventSeries');
    const seriesSnapshot = await get(seriesRef);
    let seriesId = null;

    seriesSnapshot.forEach(childSnapshot => {
        if (childSnapshot.val().title === seriesTitle) {
            seriesId = childSnapshot.key;
        }
    });

    if (!seriesId) {
        console.log("No series data available");
        return null;
    }

    const seriesData = seriesSnapshot.child(seriesId).val();
    const eventIds = Object.keys(seriesData.events || {});
    const events = await Promise.all(
        eventIds.map(async (eventId) => {
            const eventRef = ref(db, `eventSeries/${seriesId}/events/${eventId}`);
            const eventSnapshot = await get(eventRef);
            return { id: eventId, ...eventSnapshot.val() };
        })
    );

    return { ...seriesData, events };
}
