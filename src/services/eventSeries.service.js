import { db } from "../config/firebase-config";
import { ref, set, update, get, child, push } from "firebase/database";


// Function to add an event series
export const addEventSeries = async (title, description) => {
    const newSeriesRef = push(ref(db, 'eventSeries')); // Generate a new series ID
    const seriesId = newSeriesRef.key;

    const series = {
        title,
        description,
        createdOn: Date.now(),
    };

    await set(newSeriesRef, series);
    return seriesId; // Return the generated series ID
};

// Function to add an event to a series
export const addEventToSeries = async (seriesId, eventId) => {
    const seriesEventRef = ref(db, `eventSeries/${seriesId}/events/${eventId}`);
    await set(seriesEventRef, true); // Add event ID to the series
};



// Fetch an event series along with its events
export async function getEventSeries(seriesId) {
    const seriesRef = ref(db, `eventSeries/${seriesId}`);
    const seriesSnapshot = await get(seriesRef);
    if (seriesSnapshot.exists()) {
        const seriesData = seriesSnapshot.val();
        const eventIds = Object.keys(seriesData.events || {});
        const events = await Promise.all(
            eventIds.map(async (eventId) => {
                const eventRef = ref(db, `events/${eventId}`);
                const eventSnapshot = await get(eventRef);
                return { id: eventId, ...eventSnapshot.val() };
            })
        );
        return { ...seriesData, events };
    } else {
        console.log("No series data available");
        return null;
    }
}
