import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { getUsers, blockUser, unblockUser, getEvents, deleteEventInDB, editEventInDB, toggleUserRole } from '../../services/admin.service';
import Pagination from '../Pagination/Pagination';

const AdminDashboard = () => {
    const { userData } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedEventId, setEditedEventId] = useState(null);
    const [editedDescription, setEditedDescription] = useState('');

    const [currentPageUsers, setCurrentPageUsers] = useState(1);
    const [currentPageEvents, setCurrentPageEvents] = useState(1);
    const itemsPerPage = 10;

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

    const startEditing = (event) => {
        setIsEditing(true);
        setEditedEventId(event.id);
        setEditedName(event.name);
        setEditedDescription(event.description);
    };

    const saveEdit = async () => {
        const updatedEvent = { id: editedEventId, name: editedName, description: editedDescription };
        await editEventInDB(updatedEvent);
        setIsEditing(false);
        fetchEvents();
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditedEventId(null);
        setEditedName('');
        setEditedDescription('');
    };

    const handleToggleUserRole = async (userId, currentRole) => {
        await toggleUserRole(userId, currentRole);
        fetchUsers();
    };

        // Pagination functions
        const paginateUsers = (pageNumber) => setCurrentPageUsers(pageNumber);
        const paginateEvents = (pageNumber) => setCurrentPageEvents(pageNumber);
    
        // Get current users and events
        const indexOfLastUser = currentPageUsers * itemsPerPage;
        const indexOfFirstUser = indexOfLastUser - itemsPerPage;
        const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    
        const indexOfLastEvent = currentPageEvents * itemsPerPage;
        const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
        const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

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
                    {currentUsers.map(user => (
                        <li key={user.id} className="mb-2">
                            <span>{user.handle} - {user.email} - {user.role}</span>
                            {user.isBlocked ? (
                                <button onClick={() => handleUnblockUser(user.uid)} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 ml-2">Unblock</button>
                            ) : (
                                <button onClick={() => handleBlockUser(user.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-2">Block</button>
                            )}
                            <button
                                onClick={() => handleToggleUserRole(user.id, user.role)}
                                className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600 ml-2"
                            >
                                {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                            </button>
                        </li>
                    ))}
                </ul>
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={users.length}
                    paginate={paginateUsers}
                    currentPage={currentPageUsers}
                />
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-2 mt-8">Events</h2>
                <ul>
                    {currentEvents.map(event => (
                        <li key={event.id} className="mb-2">
                            {isEditing && event.id === editedEventId ? (
                                <>
                                    <input
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        placeholder="Event Name"
                                        className="border border-gray-300 px-3 py-2 rounded-md mb-2"
                                    />
                                    <input
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        placeholder="Event Description"
                                        className="border border-gray-300 px-3 py-2 rounded-md mb-2"
                                    />
                                    <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 ml-2">Save</button>
                                    <button onClick={cancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 ml-2">Cancel</button>
                                </>
                            ) : (
                                <>
                                    <span>{event.name} - {event.description}</span>
                                    <button onClick={() => handleDeleteEvent(event.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-2">Delete</button>
                                    <button onClick={() => startEditing(event)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 ml-2">Edit</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={events.length}
                    paginate={paginateEvents}
                    currentPage={currentPageEvents}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
