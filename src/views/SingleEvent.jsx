import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById, updateEvent, deleteEventInDB, fetchEventFromDB } from "../services/event.service";
import Event from "../components/Event/Event";

export default function SingleEvent() {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const { id } = useParams();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const fetchedEvent = await fetchEventFromDB(id);
                setEvent(fetchedEvent);
            } catch (error) {
                console.error('Error fetching event:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchEvent();
    }, [id]);

    const deleteEvent = async () => {
        try {
            await deleteEventInDB(id, event.organizer);
            setEvent(null);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const fetchEvent = async () => {
        try {
            const fetchedEvent = await getEventById(event.id);
            setEvent(fetchedEvent);
        } catch (error) {
            console.error('Error fetching event:', error);
        }
    };

    const editEvent = async (eventId, updatedEvent) => {
        try {
            await updateEvent(eventId, updatedEvent);
            fetchEvent(); // Re-fetch event after editing
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Render loading state
    }

    return (
        <div>
            {event ? (
                <Event
                    event={event}
                    deleteEvent={deleteEvent}
                    editEvent={(updatedEvent) => editEvent(id, updatedEvent)}
                    fetchEvent={fetchEvent}
                    isSingleView={true}
                />
            ) : (
                <b style={{ fontSize: '2em' }}>Event deleted successfully.</b>
            )}
        </div>
    );
}
