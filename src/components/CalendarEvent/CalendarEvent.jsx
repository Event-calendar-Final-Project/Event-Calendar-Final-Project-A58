import LikeDislikeButton from "../LikeDislikeButton/LikeDislikeButton";
import { likeEvent, dislikeEvent } from "../../services/event.service";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function CalendarEvent({ event, isEditMode, setEditMode, onSave }) {

    const { userData } = useContext(AppContext);
    const [editedEvent, setEditedEvent] = useState(event);

    const handleLike = async () => {
        console.log('Liked');
        await likeEvent(event.id, userData.handle);
    };

    const handleDislike = async () => {
        console.log('Disliked');
        await dislikeEvent(event.id, userData.handle);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedEvent(prev => ({ ...prev, [name]: value }));
    };

    return (
      <div className="flex flex-row bg-base-200 rounded-box max-w-lg">
        <div className="flex flex-col gap-4 p-4 flex-1">
          <h3 className="text-secondary font-medium">{event.name}</h3>
          <span>{event.description}</span>
          {event.invitedUsers && (
            <span>Invited Users: {Object.keys(event.invitedUsers).length}</span>
          )}
          {event.photo && (
            <img src={event.photo} alt="Event" className="w-32 h-32" />
          )}
  
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-medium text-sm ml-2">{event.author}</span>
            </div>
            <LikeDislikeButton initialLikes={event.likedBy.length} onLike={handleLike} onDislike={handleDislike} />
                <Link to={`/single-events/${event.id}`}>
                  <button className="btn btn-xs btn-outline btn-info">View</button>
                </Link>
                {isEditMode ? (
        <>
          <input
            type="text"
            name="title"
            value={editedEvent.title}
            onChange={handleChange}
          />
          {/* Add other fields as inputs */}
          <button onClick={() => onSave(editedEvent)}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h1>{event.title}</h1>
          {/* Display other fields */}
          <button onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}
          </div>
        </div>
      </div>
    );
  }