import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { updateEvent } from '../../services/event.service';

export default function Participants({ event }) {
  const { userData } = useContext(AppContext);
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);

  useEffect(() => {
    const initialParticipants = event.participants
      ? event.participants.includes(event.author)
        ? [...event.participants]
        : [event.author, ...(event.participants || [])]
      : [event.author];
    setParticipants(initialParticipants);
  }, [event]);


  const joinEvent = async () => {
    if (!participants.includes(userData.handle)) {
      const updatedParticipants = [...participants, userData.handle];
      setParticipants(updatedParticipants);


      const updatedEventData = {
        ...event,
        participants: updatedParticipants
      };

      try {
       
        await updateEvent(event.id, updatedEventData);
        console.log("Joined event successfully");
      } catch (error) {
        console.error("Error joining event:", error);
      }
    }
  };

  const toggleParticipantsList = () => {
    setShowParticipants(!showParticipants);
  };

  return (
    <div>
      <button className="btn min-w-auto w-32 h-10 bg-blue-300 p-2 rounded-t-xl hover:bg-blue-500 text-white font-semibold transition-transform hover:-translate-y-2 ease-in-out" onClick={toggleParticipantsList}>
        Show Participants ({participants.length})
      </button>
      {showParticipants && (
        <ul style={{
          maxHeight: participants.length > 5 ? '200px' : 'auto',
          overflowY: participants.length > 5 ? 'scroll' : 'visible'
        }}>
          {participants.map((participant, index) => (
            <li key={index}>{participant}</li>
          ))}
        </ul>
      )}
      {((event.author !== userData.handle) && !participants.includes(userData.handle)) && (
        <button className="btn btn-primary" onClick={joinEvent}>
          Join Event
        </button>
      )}
    </div>
  );
};

