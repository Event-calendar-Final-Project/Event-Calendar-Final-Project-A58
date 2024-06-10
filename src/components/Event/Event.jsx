import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { likeEvent, dislikeEvent, getEventById } from '../../services/event.service';
import PhotoPreview from '../PhotoPreview/PhotoPreview';
import { updateEventPhoto } from '../../services/upload.service';
import InvitePermissions from '../InvitePermissions/InvitePermissions';
import { updateEvent } from '../../services/event.service';
import LikeDislikeButton from '../LikeDislikeButton/LikeDislikeButton';
import Invite from '../Invite/Invite';
import { setupInvitedUsersListener } from '../../services/notification.service';


export default function Event({ event: initialEvent, deleteEvent, editEvent, isSingleView }) {
    const { userData } = useContext(AppContext);
    const [event, setEvent] = useState(initialEvent);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(event.name);
    const [editedDescription, setEditedDescription] = useState(event.description);
    const [editedPhoto, setEditedPhoto] = useState(null);
    const [file, setFile] = useState(null);
    const [oldPhotoUrl, setOldPhotoUrl] = useState(null);
    const [eventType, setEventType] = useState(event.type);
    const [eventVisibility, setEventVisibility] = useState('public');
    const [triggerEffect, setTriggerEffect] = useState(false);


    useEffect(() => {
        fetchEvent();
        setTriggerEffect(false);
    }, [triggerEffect]);

    useEffect(() => {
      if (event && userData) {
        setupInvitedUsersListener(event, userData);
    }
    }, [event.invitedUsers]);

    const fetchEvent = async () => {
        const fetchedEvent = await getEventById(initialEvent.id);
        setEvent(fetchedEvent);
    };

    const handleUserAdded = () => {
      setTriggerEffect(true);
    };

    const handleLike = async () => {
      console.log('Liked');
      await likeEvent(event.id, userData.handle);
  };

  const handleDislike = async () => {
      console.log('Disliked');
      await dislikeEvent(event.id, userData.handle);
  };

    const handleDelete = () => {
        deleteEvent(event.id);
    };

    const startEditing = () => {
        setIsEditing(true);
    };

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
      setOldPhotoUrl(event.photoUrl);
    };

    const updateEventTypeAndVisibility = async () => {
      
            console.log(event.id, { type: eventVisibility});
      await updateEvent(event.id, {...event, type: eventVisibility });

      fetchEvent();
  };

    const saveEdit = async () => {
      const updatedEvent = { ...event, name: editedName, description: editedDescription };
      
      if (editedPhoto && event.photo) {
          try {
              const result = await updateEventPhoto(editedPhoto, event.name, event.photo);
              console.log('Photo updated:', result.downloadURL);
              updatedEvent.photo = result.downloadURL;
          } catch (error) {
              console.error('Failed to update photo:', error);
          }
      }
    
      await editEvent(updatedEvent);
      setIsEditing(false);
      fetchEvent();
    };

      return (
        <div className="flex flex-row bg-base-200 rounded-box max-w-lg">
          <div
            className="bg-center rounded-l-box w-48 h-48"
            style={{ backgroundImage: `url(${event.photo || '/backgrounds/forest.jpg'})` }}
          ></div>
          <div className="flex flex-col gap-4 p-4 flex-1">
          {isEditing ? (
  <>
    <label className="text-secondary font-medium">Edit Event Name:</label>
    <input
      value={editedName}
      onChange={(e) => w(e.target.value)}
      placeholder="Event Name"
      className="input input-bordered"
    />
    <label className="text-secondary font-medium">Edit Event Description:</label>
    <input
      value={editedDescription}
      onChange={(e) => setEditedDescription(e.target.value)}
      placeholder="Event Description"
      className="input input-bordered"
    />
    <label className="text-secondary font-medium">Edit Event Photo:</label>
    <input
      type="file"
      onChange={(e) => setEditedPhoto(e.target.files[0])}
      className="input input-bordered"
    />
    {editedPhoto && <PhotoPreview photo={editedPhoto} />}
  </>
) : (
  <>
    <h3 className="text-secondary font-medium">{event.name}</h3>
    <span>{event.description}</span>
    {event.photo && (
      <img src={event.photo} alt="Event" className="w-32 h-32" />
    )}
  </>
)}
  
            <div className="flex justify-between items-center">
              <div className="flex items-center">
 
                <span className="font-medium text-sm ml-2">{event.author}</span>
              </div>
              <span className="text-sm">{new Date(event.createdOn).toLocaleDateString('bg-BG')}</span>
            </div>
    
            <div className="flex flex-col gap-2">
              {!isSingleView && (
                <Link to={`/events/${event.id}`}>
                  <button className="btn btn-xs btn-outline btn-info">View</button>
                </Link>
              )}
{(userData && eventType !== 'draft' ) && (      <LikeDislikeButton
        initialLikes={event.likedBy.length}
        onLike={handleLike}
        onDislike={handleDislike}
      />)}

              {isSingleView && event.photo && (
                <img src={event.photoUrl} alt="Event" className="w-32 h-32" />
              )}
            </div>
    
            {isSingleView && userData && (userData.handle === event.author || userData.isAdmin) && !userData.isBlocked && (
              <>
                <button onClick={handleDelete} className="btn btn-xs btn-warning">Delete</button>
                {userData.handle === event.author && (
                  isEditing ? (
                    <button onClick={saveEdit} className="btn btn-xs btn-primary">Save</button>
                  ) : (
                    <button onClick={startEditing} className="btn btn-xs btn-accent">Edit</button>
                  )
                )}
                 {< InvitePermissions event={event} />}
                 {< Invite initialEvent={event} onUserAdded={handleUserAdded} />}
              </>
            )}
       

          </div>
          {eventType === 'draft' && (
                <>
                    <button onClick={updateEventTypeAndVisibility} className="btn btn-xs btn-primary">Create Event</button>
                    <select value={eventVisibility} onChange={(e) => setEventVisibility(e.target.value)} className="select select-bordered select-xs">
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </>
            )}
        </div>
      );
    };

Event.propTypes = {
    event: PropTypes.shape({
        id: PropTypes.string,
        author: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        createdOn: PropTypes.string,
        likedBy: PropTypes.array,
        name: PropTypes.string,
    }),
    deleteEvent: PropTypes.func,
    editEvent: PropTypes.func,
    isSingleView: PropTypes.bool,
};
