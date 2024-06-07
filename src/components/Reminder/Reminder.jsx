import { useEffect, useState, useContext } from 'react';
import { getAllEvents } from '../../services/event.service';
import { AppContext } from '../../context/AppContext';

export default function Reminder() {
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    getAllEvents('').then((allEvents) => {
      const now = new Date();
      const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      let filteredEvents = allEvents.filter(event => {
        const eventDate = new Date(event.startDateTime);
        return event.type === 'private' && 
          (event.author === userData.handle || Object.keys(event.invitedUsers).includes(userData.handle)) &&
          eventDate > now && 
          eventDate <= oneWeekLater;
      });
      setEvents(filteredEvents);
    });
  }, [userData]);

  const calculateRemainingTime = (eventDate) => {
    const now = new Date();
    const timeUntilEvent = new Date(eventDate) - now;
    if (timeUntilEvent < 0) {
      return 'Event has passed';
    }
    const days = Math.floor(timeUntilEvent / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeUntilEvent % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilEvent % (1000 * 60 * 60)) / (1000 * 60));
    return `${days} days, ${hours} hours, and ${minutes} minutes`;
  };

  return (
    <div>
      <h2>Upcoming Events</h2>
      {events.length > 0 ? (
        <div>
          <button onClick={() => setShowEvents(!showEvents)}>
            {showEvents ? 'Hide' : `${events.length} upcoming events`}
          </button>
          {showEvents && (
            <div>
{events.map(event => (
  <div key={event.id}>
    {event.name} {new Date(event.startDateTime).toLocaleDateString('default', { day: '2-digit', month: '2-digit' }).replace(/\//g, '.')}: Remaining time - {calculateRemainingTime(event.startDateTime)}
  </div>
))}
            </div>
          )}
        </div>
      ) : (
        <p>No upcoming events.</p>
      )}
    </div>
  );
};