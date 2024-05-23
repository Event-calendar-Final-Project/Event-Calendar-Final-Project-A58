import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { likeEvent, dislikeEvent, getEventById, inviteUser, disinviteUser} from '../../services/event.service';
import { getUserByHandle } from '../../services/users.service';


const contentEvent = {};

export default function Event({ event: initialEvent, deleteEvent, editEvent, isSingleView }) {
    const { userData } = useContext(AppContext);
    const [event, setEvent] = useState(initialEvent);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(event.description);
    const [organizerData, setOrganizerData] = useState(null);
    const [inviteHandle, setInviteHandle] = useState('');

    useEffect(() => {
        fetchEvent();
        fetchOrganizerData();
    }, []);

    const fetchEvent = async () => {
        const fetchedEvent = await getEventById(initialEvent.id);
        setEvent(fetchedEvent);
    };

    const fetchOrganizerData = async () => {
        const data = await getUserByHandle(event.author);
        setOrganizerData(data.val());
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
        try {
            await inviteUser(event.id, inviteHandle);
            setInviteHandle('');
            fetchEvent();
        } catch (error) {
            console.error('Error inviting user:', error);
        }
    };

    const disinvite = async (userId) => {
        try {
            await disinviteUser(event.id, userId);
            fetchEvent();
        } catch (error) {
            console.error('Error disinviting user:', error);
        }
    };

    return (
        <div className="event">
            {isEditing ? (
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                />
            ) : (
                <h1 style={{ color: '#0a9396' }}>{event.name}</h1>
            )}
            <div style={contentEvent}>{event.author}, {new Date(event.createdOn).toLocaleDateString('bg-BG')}</div>
            {organizerData && organizerData.photoData && (
                <img src={`data:image/jpg;base64,${organizerData.photoData}`} style={{ width: '10%', maxWidth: '50%', display: 'block', margin: '0 auto', paddingTop: '15px' }} alt="No User Photo" />
            )}
            <div style={contentEvent}>{event.description}</div>
            {isSingleView && event.photoUrl && (
                <div>
                    <img src={event.photoUrl} alt="Event" style={{ maxWidth: '100%' }} />
                </div>
            )}
            {!isSingleView && <Link to={`/events/${event.id}`}><button >View</button></Link>}
            <p></p>
            {event?.likedBy.includes(userData?.handle)
                ? <button onClick={dislike} >Dislike</button>
                : <button onClick={like} >Like</button>
            }

            {isSingleView && userData && (userData.handle === event.author || userData.isAdmin) && !userData.isBlocked && (
                <>
                    <button onClick={handleDelete} >Delete</button>
                    {userData && userData.handle === event.author && (
                        isEditing ? (
                            <button onClick={saveEdit} >Save</button>
                        ) : (
                            <button onClick={startEditing} >Edit</button>
                        )
                    )}
                </>
            )}

            <button onClick={like} >{`Likes: ${event.likedBy.length}`}</button>

            <div>
                <input
                    value={inviteHandle}
                    onChange={(e) => setInviteHandle(e.target.value)}
                    placeholder="User handle to invite"
                />
                <button onClick={invite} >Invite</button>
            </div>
            {event.invitedUsers && Object.keys(event.invitedUsers).map((userId) => (
                <div key={userId}>
                    <span>{userId}</span>
                    <button onClick={() => disinvite(userId)} style={{ background: 'red' }}>Disinvite</button>
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
    }),
    deleteEvent: PropTypes.func,
    editEvent: PropTypes.func,
    isSingleView: PropTypes.bool,
}
