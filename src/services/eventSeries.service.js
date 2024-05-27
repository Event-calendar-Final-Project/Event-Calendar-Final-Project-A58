import { db } from "../config/firebase-config";
import { ref, set, get, push } from "firebase/database";

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

// Function to add an event to a series with recurrence options by title
export const addEventToSeriesByTitle = async (seriesTitle, eventTitle, eventDescription, startDate, endDate, repeat) => {
    // Find series by title
    const seriesRef = ref(db, 'eventSeries');
    const seriesSnapshot = await get(seriesRef);
    let seriesId = null;

    seriesSnapshot.forEach(childSnapshot => {
        if (childSnapshot.val().title === seriesTitle) {
            seriesId = childSnapshot.key;
        }
    });

    if (!seriesId) {
        throw new Error(`Series with title ${seriesTitle} not found.`);
    }

    const newEventRef = push(ref(db, `eventSeries/${seriesId}/events`));
    const eventId = newEventRef.key;

    const event = {
        title: eventTitle,
        description: eventDescription,
        startDate,
        endDate: endDate || null,
        repeat, // 'none', 'weekly', 'monthly', 'yearly'
        createdOn: Date.now(),
    };

    await set(newEventRef, event);

    if (repeat !== 'none') {
        await generateRecurringEvents(seriesId, eventId, eventTitle, eventDescription, new Date(startDate), endDate ? new Date(endDate) : null, repeat);
    }
};

// Function to generate recurring events
const generateRecurringEvents = async (seriesId, originalEventId, title, description, startDate, endDate, repeat) => {
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
            title,
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
