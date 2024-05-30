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
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <input
                type="text"
                placeholder="Search users or events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md mb-4"
            />
            <div className="flex space-x-4 mb-4">
                <button onClick={fetchUsers} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Search Users</button>
                <button onClick={fetchEvents} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Search Events</button>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-2">Users</h2>
                <ul>
                    {users.map(user => (
                        <li key={user.id} className="mb-2">
                            <span>{user.username} - {user.email} - {user.role}</span>
                            {user.isBlocked ? (
                                <button onClick={() => handleUnblockUser(user.id)} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 ml-2">Unblock</button>
                            ) : (
                                <button onClick={() => handleBlockUser(user.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-2">Block</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-2 mt-8">Events</h2>
                <ul>
                    {events.map(event => (
                        <li key={event.id} className="mb-2">
                            <span>{event.name} - {event.description}</span>
                            <button onClick={() => handleDeleteEvent(event.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-2">Delete</button>
                            <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 ml-2">Edit</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
