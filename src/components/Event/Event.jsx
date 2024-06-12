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
import Participants from '../Participants/Participants';


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
    try {
      console.log('Liked');
      await likeEvent(event.id, userData.handle);
    } catch (error) { console.error('Error liking event:', error); }
  };

  const handleDislike = async () => {
    try {
      console.log('Disliked');
      await dislikeEvent(event.id, userData.handle);
    } catch (error) { console.error('Error disliking event:', error); }
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
    try {
      console.log(event.id, { type: eventVisibility });
      await updateEvent(event.id, { ...event, type: eventVisibility });
      fetchEvent();
    } catch (error) { console.error('Error updating event type:', error); }
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
    <div className="relative flex w-full max-w-[48rem] flex-row rounded-xl bg-gray-200 bg-clip-border text-gray-700 shadow-md">
      <div className="relative m-0 w-2/5 shrink-0 overflow-hidden rounded-xl rounded-r-none bg-white bg-clip-border text-gray-700">
        <img
          src={event.photo || '/backgrounds/forest.jpg'}
          alt="Event"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col justify-between w-3/5">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Event Name"
              className="input input-bordered"
            />
            <input
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Event Description"
              className="input input-bordered"
            />
            <input
              type="file"
              onChange={(e) => setEditedPhoto(e.target.files[0])}
              className="input input-bordered"
            />
            {editedPhoto && <PhotoPreview photo={editedPhoto} />}
          </div>
        ) : (
          <div>
            <h6 className="mb-4 block font-sans text-base font-semibold uppercase leading-relaxed tracking-normal text-pink-500 antialiased">
              {event.type}
            </h6>
            <h4 className="mb-2 block font-sans text-2xl font-semibold leading-snug rounded-xl tracking-normal text-blue-gray-900 antialiased shadow-lg shadow-gray-400 p-4 font-serif">
  {event.name}
</h4>
<p className="mb-8 block font-sans text-xl font-normal leading-relaxed text-gray-700 antialiased font-serif p-4">
  {event.description}
</p>
          </div>
        )}

        <div className="flex flex-col items-start">
          <span className="font-medium text-blue-gray-400 font-serif">{event.author}</span>
          <span className="font-medium text-blue-gray-400 font-serif">{new Date(event.startDateTime).toLocaleDateString('bg-BG')}</span>
        </div>

        <div className="flex items-center gap-2">
          {!isSingleView && (
            <Link to={`/events/${event.id}`}>
              <button className="flex select-none items-center gap-2 rounded-lg py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:bg-pink-500/10 active:bg-pink-500/30">
                View
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </button>
            </Link>
          )}

        </div>

        <div className="flex items-center gap-4 mt-4">
    {isSingleView && userData && ((!event.invitationPermission || Object.keys(event.invitationPermission).length === 0)
        ? userData.handle === event.author
        : (userData.handle === event.author || Object.keys(event.invitationPermission).includes(userData.handle)))
        && <Invite initialEvent={event} onUserAdded={handleUserAdded} />}
    {isSingleView && userData && <Participants event={event} />}
</div>

        {isSingleView && userData && (userData.handle === event.author || userData.isAdmin) && !userData.isBlocked && (
          <div className="flex items-center gap-2 mt-4">
                      {userData && eventType !== 'draft' && (
            <LikeDislikeButton
              initialLikes={event.likedBy.length}
              onLike={handleLike}
              onDislike={handleDislike}
            />
          )}
            <button onClick={handleDelete} className="btn btn-xs min-w-auto w-14 h-14 bg-red-300 p-2 rounded-full hover:bg-red-500 text-white font-semibold transition-rotation duration-300 hover:-rotate-45 ease-in-out">Delete</button>
            {userData.handle === event.author && (
              isEditing ? (
                <button onClick={saveEdit} className="btn btn-xs min-w-auto w-14 h-14 bg-blue-300 p-2 rounded-full hover:bg-blue-500 text-white font-semibold transition-rotation duration-300 hover:rotate-90 ease-in-out">Save</button>
              ) : (
                <button onClick={startEditing} className="btn btn-xs min-w-auto w-14 h-14 bg-blue-300 p-2 rounded-full hover:bg-blue-500 text-white font-semibold transition-rotation duration-300 hover:rotate-90 ease-in-out">Edit</button>
              )
            )}
            <InvitePermissions event={event} />
          </div>
        )}

      </div>
      {eventType === 'draft' && (
        <div className="flex flex-col items-start gap-2 ml-4">
          <button onClick={updateEventTypeAndVisibility} className="btn btn-xs btn-primary">Create Event</button>
          <select value={eventVisibility} onChange={(e) => setEventVisibility(e.target.value)} className="select select-bordered select-xs">
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      )}
    </div>
  );
}



Event.propTypes = {
    event: PropTypes.shape({
      id: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      createdOn: PropTypes.string,
      likedBy: PropTypes.arrayOf(PropTypes.string),
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      startDateTime: PropTypes.string,
      photoUrl: PropTypes.string,
      invitationPermission: PropTypes.object,
      invitedUsers: PropTypes.object,
    }),
    deleteEvent: PropTypes.func,
    editEvent: PropTypes.func,
    isSingleView: PropTypes.bool,
};
