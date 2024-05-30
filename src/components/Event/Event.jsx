
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { onValue, ref } from 'firebase/database';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { likeEvent, dislikeEvent, getEventById, inviteUser, disinviteUser } from '../../services/event.service';
import { getUserByHandle } from '../../services/users.service';
import { db } from '../../config/firebase-config';

export default function Event({ event: initialEvent, deleteEvent, editEvent, isSingleView }) {
    const { userData } = useContext(AppContext);
    const [event, setEvent] = useState(initialEvent);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(event.description);
    const [organizerData, setOrganizerData] = useState(null);
    const [inviteHandle, setInviteHandle] = useState('');
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvent();
        fetchOrganizerData();
        fetchUserContacts();
    }, []);
    useEffect(() => {
        setupInvitedUsersListener();
    }, [event.id.invitedUsers]);

    const fetchEvent = async () => {
        const fetchedEvent = await getEventById(initialEvent.id);
        setEvent(fetchedEvent);
    };

    const fetchOrganizerData = async () => {
        const data = await getUserByHandle(event.author);
        setOrganizerData(data.val());
    };

    const fetchUserContacts = async () => {
        const data = await getUserByHandle(userData.handle);
        if (data.exists()) {
            const userContacts = userData.contacts || {};
            setContacts(Object.keys(userContacts));
        }
    };

    const like = async () => {
        await likeEvent(event.id, userData.handle);
        fetchEvent();
    };

    const dislike = async () => {
        await dislikeEvent(event.id, userData.handle);
        fetchEvent();
    };

    const handleDelete = () => {
        deleteEvent(event.id);
    };

    const startEditing = () => {
        setIsEditing(true);
    };

    const saveEdit = async () => {
        const updatedEvent = { ...event, content: editedContent };
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

    const setupInvitedUsersListener = () => {
        const invitedUsersRef = ref(db, `events/${initialEvent.id}/invitedUsers`);
        onValue(invitedUsersRef, (snapshot) => {
            if (snapshot.exists()) {
                const invitedUsers = snapshot.val();
                if (userData.handle in invitedUsers) {
                    alert(`You have been invited to ${initialEvent.name}!`);
                }
            }
        });
    };

    useEffect(() => {
        const filtered = contacts.filter(contact => contact.includes(inviteHandle));
        setFilteredContacts(filtered);
    }, [inviteHandle, contacts]);

    return (
        <div className="event">
            {isEditing ? (
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                />
            ) : (
                <h1 className="text-teal-500" style={{ fontWeight: 'bold', fontSize: 'larger' }}>{event.name}</h1>
            )}
            <div className="text-gray-500">{event.author}, {new Date(event.createdOn).toLocaleDateString('bg-BG')}</div>
            {organizerData && organizerData.photoData && (
                <img src={`data:image/jpg;base64,${organizerData.photoData}`} className="w-10 max-w-50 block mx-auto pt-15" alt="No User Photo" />
            )}
            <div className="text-gray-500">{event.description}</div>
            {isSingleView && event.photoUrl && (
                <div>
                    <img src={event.photoUrl} alt="Event" className="max-w-full" />
                </div>
            )}
            {!isSingleView && <Link to={`/events/${event.id}`}><button className="btn">View</button></Link>}
            <p></p>
            {event?.likedBy.includes(userData?.handle)
                ? <button onClick={dislike} className="btn">Dislike</button>
                : <button onClick={like} className="btn">Like</button>
            }

            {isSingleView && userData && (userData.handle === event.author || userData.isAdmin) && !userData.isBlocked && (
                <>
                    <button onClick={handleDelete} className="btn">Delete</button>
                    {userData && userData.handle === event.author && (
                        isEditing ? (
                            <button onClick={saveEdit} className="btn">Save</button>
                        ) : (
                            <button onClick={startEditing} className="btn">Edit</button>
                        )
                    )}
                </>
            )}

            <button onClick={like} className="btn">{`Likes: ${event.likedBy.length}`}</button>

            <div>
                <input
                    value={inviteHandle}
                    onChange={(e) => setInviteHandle(e.target.value)}
                    placeholder="User handle to invite"
                    list="contacts-list"
                />
                <datalist id="contacts-list">
                    {filteredContacts.map(contact => (
                        <option key={contact} value={contact} />
                    ))}
                </datalist>
                <button onClick={invite} className="btn">Invite</button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
            {event.invitedUsers && Object.keys(event.invitedUsers).map((userId) => (
                <div key={userId}>
                    <span>{userId}</span>
                    <button onClick={() => disinvite(userId)} className="btn bg-red-500">Disinvite</button>
                </div>
            ))}
        </div>
    );
}

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



