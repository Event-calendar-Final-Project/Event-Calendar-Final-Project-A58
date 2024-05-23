import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById, updateEvent,  deleteEventInDB, fetchEventFromDB } from "../../services/event.service";
import Event from "../../components/Event/Event";

export default function SingleEvent() {
    const [event, setEvent] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchEvent = async () => {
          const event = await fetchEventFromDB(id);
          setEvent(event);
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
        const fetchedEvent = await getEventById(event.id);
        setEvent(fetchedEvent);
    };

    const editEvent = async (eventId, updatedEvent) => {
        try {
            await updateEvent(eventId, updatedEvent);
        } catch (error) {
            console.error('Error updating event:', error);
            throw error; 
        }
    };
    
    return (
        <div>
                {event ? <Event event={event} deleteEvent={deleteEvent} editEvent={(updatedEvent) => editEvent(id, updatedEvent)}
                 fetchEvent={fetchEvent} isSingleView={true}/> :<b style={{ fontSize: '2em' }}>Event deleted successfully.</b>}
        </div>
    )
}
