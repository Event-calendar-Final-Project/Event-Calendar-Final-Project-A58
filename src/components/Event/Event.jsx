import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { onValue, ref, update } from 'firebase/database';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { likeEvent, dislikeEvent, getEventById, inviteUser, disinviteUser } from '../../services/event.service';
import { getUserByHandle } from '../../services/users.service';
import { db } from '../../config/firebase-config';
import PhotoPreview from '../PhotoPreview/PhotoPreview';
import { updateEventPhoto } from '../../services/upload.service';
import InvitePermissions from '../InvitePermissions/InvitePermissions';
import { updateEvent } from '../../services/event.service';
import LikeDislikeButton from '../LikeDislikeButton/LikeDislikeButton';
import Invite from '../Invite/Invite';


export default function Event({ event: initialEvent, deleteEvent, editEvent, isSingleView }) {
    const { userData } = useContext(AppContext);
    const [event, setEvent] = useState(initialEvent);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(event.name);
    const [editedDescription, setEditedDescription] = useState(event.description);
    const [inviteHandle, setInviteHandle] = useState('');
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [error, setError] = useState('');
    const [contactListName, setContactListName] = useState('');
    const [editedPhoto, setEditedPhoto] = useState(null);
    const [file, setFile] = useState(null);
    const [oldPhotoUrl, setOldPhotoUrl] = useState(null);
    const [showInvitePermissions, setShowInvitePermissions] = useState(false);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [eventType, setEventType] = useState(event.type);
    const [eventVisibility, setEventVisibility] = useState('public');


    useEffect(() => {
        fetchEvent();
 
        fetchUserContacts();
    }, []);

    useEffect(() => {
        setupInvitedUsersListener();
    }, [event.invitedUsers]);

    const fetchEvent = async () => {
        const fetchedEvent = await getEventById(initialEvent.id);
        setEvent(fetchedEvent);
    };


    const fetchUserContacts = async () => {
        const data = await getUserByHandle(userData.handle);
        if (data.exists()) {
            const userContacts = userData.contacts || {};
            setContacts(Object.keys(userContacts));
        }
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

    const invite = async () => {
        if (contacts.includes(inviteHandle)) {
            try {
                await inviteUser(event.id, inviteHandle);
                setInviteHandle('');
                setError('');
                fetchEvent();
            } catch (error) {
                console.error('Error inviting user:', error);
                setError('Error inviting user.');
            }
        } else {
            setError('User is not in your contacts.');
        }
    };

    const disinvite = async (userId) => {
        try {
            await disinviteUser(event.id, userId);
            fetchEvent();
        } catch (error) {
            console.error('Error disinviting user:', error);
            setError('Error disinviting user.');
        }
    };

    const inviteContactList = async () => {
        console.log('Inviting users from contact list:', Object.keys(userData.contactLists), contactListName);
        const contactList = Object.keys(userData.contactLists).find(list => list === contactListName);
        console.log('Contact list:', contactList);
        console.log('Contact lists:', userData.contactLists[contactList]);
        if (contactList) {
            const contactsInList = userData.contactLists[contactList];
            try {
                for (const contact of contactsInList) {
                    await inviteUser(event.id, contact);
                }
                setContactListName('');
                setError('');
                fetchEvent();
                console.log('Invited users from the contact list.');
            } catch (error) {
                console.error('Error inviting users from the contact list:', error);
                setError('Error inviting users from the contact list.');
            }
        } else {
            setError('Contact list not found.');
        }
    };

    const setupInvitedUsersListener = () => {
      const invitedUsersRef = ref(db, `events/${event.id}/invitedUsers`);
      onValue(invitedUsersRef, (snapshot) => {
          if (snapshot.exists()) {
              const invitedUsers = snapshot.val();
              if (userData.handle in invitedUsers && invitedUsers[userData.handle] === true) {
                  console.log('Invited users:', invitedUsers);
                  alert(`You have been invited to ${initialEvent.name}!`);
  
                  // Update the invitedUsers in the local state
                  const updatedEvent = {
                      ...event,
                      invitedUsers: {
                          ...event.invitedUsers,
                          [userData.handle]: false
                      }
                  };
                  setEvent(updatedEvent);
  
                  // Update the invitedUsers in the database
                  const updates = {};
                  updates[`events/${event.id}/invitedUsers/${userData.handle}`] = false;
                  update(ref(db), updates)
                      .then(() => {
                          console.log(`Successfully updated invitedUser ${userData.handle} to false in event ${event.id}`);
                      })
                      .catch((error) => {
                          console.error('Error updating invitedUser:', error);
                      });
                  
                  console.log('Invited users after update:', updatedEvent.invitedUsers);
              }
          }
      });
  };

    useEffect(() => {
        const filtered = contacts.filter(contact => contact.includes(inviteHandle));
        setFilteredContacts(filtered);
    }, [inviteHandle, contacts]);

    return (
        <div className="flex flex-row bg-base-200 rounded-box max-w-lg">
          {/* Image */}
          <div
            className="bg-center rounded-l-box w-48 h-48"
            style={{ backgroundImage: `url(${event.photo || '/backgrounds/forest.jpg'})` }}
          ></div>
    
          {/* Body */}
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
    {event.invitedUsers && (
      <span>Invited Users: {Object.keys(event.invitedUsers).length}</span>
    )}
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
                 {< Invite event={event} />}
              </>
            )}
    
            <div className="flex flex-col gap-2">
              <input
                value={inviteHandle}
                onChange={(e) => setInviteHandle(e.target.value)}
                placeholder="User handle to invite"
                list="contacts-list"
                className="input input-bordered input-xs"
              />
              <datalist id="contacts-list">
                {filteredContacts.map(contact => (
                  <option key={contact} value={contact} />
                ))}
              </datalist>
              <button onClick={invite} className="btn btn-xs btn-outline btn-success">Invite User</button>
              
              <input
                value={contactListName}
                onChange={(e) => setContactListName(e.target.value)}
                placeholder="Contact list to invite"
                className="input input-bordered input-xs"
              />
              <button onClick={inviteContactList} className="btn btn-xs btn-info">Invite Contact List</button>
              
              {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
    
    {userData && event.invitedUsers && (event.invitationPermission || userData.handle === event.author || userData.isAdmin) && Object.keys(event.invitedUsers).map((userId) => (
  <div key={userId} className="flex items-center gap-2">
    <span>{userId}</span>
    <button onClick={() => disinvite(userId)} className="btn btn-xs bg-red-500">Disinvite</button>
  </div>
))}
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
