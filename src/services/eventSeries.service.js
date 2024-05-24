import { db } from "../config/firebase-config";
import { ref, set, update, get, child } from "firebase/database";

// Add a new event series
export async function addEventSeries(seriesId, title, description) {
    const seriesRef = ref(db, `eventSeries/${seriesId}`);
    await set(seriesRef, { title, description, events: {} });
}

// Add an event to an existing series
export async function addEventToSeries(seriesId, eventId) {
    const seriesRef = ref(db, `eventSeries/${seriesId}/events/${eventId}`);
    await set(seriesRef, true);
}

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
