import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { getUsers, blockUser, unblockUser, getEvents, deleteEventInDB } from '../../services/admin.service';

const AdminDashboard = () => {
    const { userData } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchEvents();
    }, []);

    const fetchUsers = async () => {
        const fetchedUsers = await getUsers(searchQuery);
        setUsers(fetchedUsers);
    };

    const fetchEvents = async () => {
        const fetchedEvents = await getEvents(searchQuery);
        setEvents(fetchedEvents);
    };

    const handleBlockUser = async (userId) => {
        await blockUser(userId);
        fetchUsers();
    };

    const handleUnblockUser = async (userId) => {
        await unblockUser(userId);
        fetchUsers();
    };

    const handleDeleteEvent = async (eventId) => {
        await deleteEventInDB(eventId, userData.handle);
        fetchEvents();
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <input
                type="text"
                placeholder="Search users or events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={fetchUsers}>Search Users</button>
            <button onClick={fetchEvents}>Search Events</button>

            <h2>Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} - {user.email} - {user.role}
                        {user.isBlocked ? (
                            <button onClick={() => handleUnblockUser(user.id)}>Unblock</button>
                        ) : (
                            <button onClick={() => handleBlockUser(user.id)}>Block</button>
                        )}
                    </li>
                ))}
            </ul>

            <h2>Events</h2>
            <ul>
                {events.map(event => (
                    <li key={event.id}>
                        {event.name} - {event.description}
                        <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                        <button>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;
