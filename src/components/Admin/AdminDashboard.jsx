import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { getUsers, blockUser, unblockUser, getEvents, deleteEventInDB, editEventInDB, toggleUserRole } from '../../services/admin.service';
import Pagination from '../Pagination/Pagination';
import { HiOutlinePencilAlt, HiOutlineTrash ,HiOutlineUserRemove, HiOutlineUserAdd, HiOutlineBan, HiOutlinePlusCircle } from 'react-icons/hi';


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
    const itemsPerPage = 7;

    const [showUsers, setShowUsers] = useState(true);

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

    
    const paginateUsers = (pageNumber) => setCurrentPageUsers(pageNumber);
    const paginateEvents = (pageNumber) => setCurrentPageEvents(pageNumber);

    
    const indexOfLastUser = currentPageUsers * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const indexOfLastEvent = currentPageEvents * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    return (
        <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <div className='flex'>
            <label className="input input-bordered flex items-center gap-2">
                <input type="text" placeholder="Search users or events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="grow" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            </label>
            <br></br>
            <div className="flex space-x-1 ml-4 mb-4 mt-1">
                <button onClick={fetchUsers} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-blue-500">Search Users</button>
                <button onClick={fetchEvents} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-blue-500">Search Events</button>
            </div>
            </div>
            <div className="flex space-x-0 mb-4 mt-8">
                <button onClick={() => setShowUsers(true)} className={`px-4 py-2 rounded-md ${showUsers ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>{"\u{1F64B}\u200D\u2642\uFE0F"}</button>
                <button onClick={() => setShowUsers(false)} className={`px-4 py-2 rounded-md ${!showUsers ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>{"\u{1F389}"}</button>
            </div>

            {showUsers ? (
                <div className="overflow-y-hidden rounded-lg border ">
                    <div className="overflow-x-auto">
                        <h2 className="text-2xl font-bold mb-2 ml-3">Users</h2>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-blue-600 text-left text-xs font-semibold uppercase tracking-widest text-white">
                                    <th className="px-5 py-3">Handle</th>
                                    <th className="px-5 py-3">Email</th>
                                    <th className="px-5 py-3">Role</th>
                                    <th className="px-5 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-500 font-bold">
                                {currentUsers.map(user => (
                                    <tr key={user.id}>
                                        <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                            {user.handle}
                                        </td>
                                        <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                            {user.email}
                                        </td>
                                        <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                            {user.role}
                                        </td>
                                        <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                            {user.isBlocked ? (
                                                <button onClick={() => handleUnblockUser(user.uid)} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 ml-2"><HiOutlinePlusCircle/></button>
                                            ) : (
                                                <button onClick={() => handleBlockUser(user.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-2"><HiOutlineBan/></button>
                                            )}
                                            <button
                                                onClick={() => handleToggleUserRole(user.id, user.role)}
                                                className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600 ml-2"
                                            >
                                                 {user.role === 'admin' ? <HiOutlineUserRemove /> : <HiOutlineUserAdd />} 
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={users.length}
                            paginate={paginateUsers}
                            currentPage={currentPageUsers}
                        />
                    </div>
                </div>
            ) : (
                <div className="overflow-y-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                        <h2 className="text-2xl font-bold mb-2 ml-3">Events</h2>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-blue-600 text-left text-xs font-semibold uppercase tracking-widest text-white">
                                    <th className="px-5 py-3">Name</th>
                                    <th className="px-5 py-3">Description</th>
                                    <th className="px-5 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-500 font-bold">
                                {currentEvents.map(event => (
                                    <tr key={event.id}>
                                        <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                            {event.name}
                                        </td>
                                        <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                            {event.description}
                                        </td>
                                        <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
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
                                                    
                                                    <button onClick={() => handleDeleteEvent(event.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-2"><HiOutlineTrash/></button>
                                                    <button onClick={() => startEditing(event)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 ml-2"><HiOutlinePencilAlt /> {/* Edit Icon */}</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={events.length}
                            paginate={paginateEvents}
                            currentPage={currentPageEvents}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
