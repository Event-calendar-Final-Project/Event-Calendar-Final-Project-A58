import { db } from "../config/firebase-config";
import { ref, set, get, push } from "firebase/database";

// Function to add an event series
export const addEventSeries = async (createdBy, title, description, endDate, repeat) => {
    const newSeriesRef = push(ref(db, 'eventSeries')); // Generate a new series ID
    const seriesId = newSeriesRef.key;

    try {
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
    } catch (error) { console.error('Error adding event series:', error); }
};


export const addEventToSeriesById = async (seriesId, author, name, description, startDateTime, endDateTime, location, photo, type) => {

    try {
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
    } catch (error) { console.error('Error adding event to series:', error); }
};


// Fetch an event series along with its events
export async function getEventSeries(seriesTitle) {
    try {
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
    } catch (error) { console.error('Error fetching event series:', error); }
}
