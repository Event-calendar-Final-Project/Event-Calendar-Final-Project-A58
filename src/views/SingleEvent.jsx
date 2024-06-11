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
            console.log('Updated event:', updatedEvent);
            console.log('Event ID:', eventId);
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
        <div className="flex justify-center items-center min-h-screen ">
            <div className="max-w-4xl p-4 mt-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-4 text-center">Event Details</h1>
                {event ? (
                    <Event
                        event={event}
                        deleteEvent={deleteEvent}
                        editEvent={(updatedEvent) => editEvent(id, updatedEvent)}
                        fetchEvent={fetchEvent}
                        isSingleView={true}
                    />
                ) : (
                    <b className="text-2xl text-center">Event deleted successfully.</b>
                )}
            </div>
        </div>
    );
}


/* return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        {event ? (
            <Event
                event={event}
                deleteEvent={deleteEvent}
                editEvent={(updatedEvent) => editEvent(id, updatedEvent)}
                fetchEvent={fetchEvent}
                isSingleView={true}
                style={{ fontSize: '5em', width: '500px', height: '500px' }} // Increase width and height
            />
        ) : (
            <b style={{ fontSize: '2em' }}>Event deleted successfully.</b>
        )}
    </div>
);
}
 */