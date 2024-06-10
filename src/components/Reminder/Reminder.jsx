import { useEffect, useState, useContext } from 'react';
import { getAllEvents } from '../../services/event.service';
import { AppContext } from '../../context/AppContext';

export default function Reminder() {
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [countdowns, setCountdowns] = useState([]);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    getAllEvents('').then((allEvents) => {
      const now = new Date();
      const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      let filteredEvents = allEvents.filter(event => {
        const eventDate = new Date(event.startDateTime);
        return event.type === 'private' && 
          (event.author === userData.handle || Object.keys(event.invitedUsers ?? {}).includes(userData.handle)) &&
          eventDate > now && 
          eventDate <= oneWeekLater;
      });
      setEvents(filteredEvents);

      // Calculate initial countdowns
      const initialCountdowns = filteredEvents.map(event => calculateRemainingTime(event.startDateTime));
      setCountdowns(initialCountdowns);

      // Update countdowns every second
      const interval = setInterval(() => {
        setCountdowns(prevCountdowns => {
          return prevCountdowns.map(countdown => {
            // Decrease seconds by 1
            countdown.seconds = countdown.seconds - 1;
            // If seconds become negative, reset to 59 and decrease minutes by 1
            if (countdown.seconds < 0) {
              countdown.seconds = 59;
              countdown.minutes = countdown.minutes - 1;
            }
            // If minutes become negative, reset to 59 and decrease hours by 1
            if (countdown.minutes < 0) {
              countdown.minutes = 59;
              countdown.hours = countdown.hours - 1;
            }
            // If hours become negative, reset to 23 and decrease days by 1
            if (countdown.hours < 0) {
              countdown.hours = 23;
              countdown.days = countdown.days - 1;
            }
            // If days become negative, reset all values to 0
            if (countdown.days < 0) {
              countdown.days = 0;
              countdown.hours = 0;
              countdown.minutes = 0;
              countdown.seconds = 0;
            }
            return countdown;
          });
        });
      }, 1000);

      return () => clearInterval(interval);
    });
  }, [userData]);

  const calculateRemainingTime = (eventDate) => {
    const now = new Date();
    const timeUntilEvent = new Date(eventDate) - now;
    if (timeUntilEvent < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const days = Math.floor(timeUntilEvent / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeUntilEvent % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilEvent % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeUntilEvent % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="stat-value text-black p-6">Upcoming Events</h2>
      {events.length > 0 ? (
        <div className="text-center">
          <button 
            onClick={() => setShowEvents(!showEvents)} 
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
          >
            {showEvents ? 'Hide Events' : `${events.length} Upcoming Events`}
          </button>
          {showEvents && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event, index) => (
                <div key={event.id} className="card shadow-md bg-white text-black">
                  <div className="card-body">
                    <h3 className="text-center text-2xl font-semibold mb-2">{event.name}</h3>
                    <p className="text-center text-lg mb-4">{new Date(event.startDateTime).toLocaleDateString('default', { day: '2-digit', month: '2-digit' }).replace(/\//g, '.')}</p>
                    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
                      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                        <span className="countdown font-mono text-5xl">
                          <span style={{'--value': countdowns[index]?.days}}></span>
                        </span>
                        days
                      </div> 
                      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                        <span className="countdown font-mono text-5xl">
                          <span style={{'--value': countdowns[index]?.hours}}></span>
                        </span>
                        hours
                      </div> 
                      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                        <span className="countdown font-mono text-5xl">
                          <span style={{'--value': countdowns[index]?.minutes}}></span>
                        </span>
                        min
                      </div> 
                      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                        <span className="countdown font-mono text-5xl">
                          <span style={{'--value': countdowns[index]?.seconds}}></span>
                        </span>
                        sec
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-lg">No upcoming events.</p>
      )}
    </div>
  );
}