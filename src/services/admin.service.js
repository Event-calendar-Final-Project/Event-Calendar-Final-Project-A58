import { ref, get, update, remove } from 'firebase/database';
import { db } from '../config/firebase-config';

// Fetch all users or search by username/email
export const getUsers = async (searchQuery = '') => {
    try {
        const usersSnapshot = await get(ref(db, 'users'));
        let users = [];

        if (usersSnapshot.exists()) {
            console.log(Object.entries(usersSnapshot.val()));
            users = Object.entries(usersSnapshot.val())
                .map(([id, userData]) => ({ id, ...userData }))
                .filter(user =>
                    user.handle?.includes(searchQuery) ||
                    user.email?.includes(searchQuery) ||
                    user.firstName?.includes(searchQuery) ||
                    user.lastName?.includes(searchQuery)
                );
                
        }

        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

// Block a user
export const blockUser = async (userId) => {
    try {
        await update(ref(db, `users/${userId}`), { isBlocked: true });
    } catch (error) {
        console.error('Error blocking user:', error);
        throw error;
    }
};

// Unblock a user
export const unblockUser = async (userId) => {
    try {
        await update(ref(db, `users/${userId}`), { isBlocked: false });
    } catch (error) {
        console.error('Error unblocking user:', error);
        throw error;
    }
};

// Fetch all events or search by name
export const getEvents = async (search = '') => {
    try {
        const eventsSnapshot = await get(ref(db, 'events'));

        if (!eventsSnapshot.exists()) {
            return [];
        }

        const events = eventsSnapshot.val();
        const searchLower = search.toLowerCase();

        return Object.entries(events)
            .map(([key, value]) => ({
                ...value,
                id: key,
                likedBy: value.likedBy ? Object.keys(value.likedBy) : [],
                createdOn: new Date(value.createdOn).toString(),
            }))
            .filter(e =>
                e.description.toLowerCase().includes(searchLower) ||
                e.name.toLowerCase().includes(searchLower) ||
                e.author.toLowerCase().includes(searchLower)
            );
    } catch (error) { console.error('Error fetching events:', error); }
};

// Delete an event
export const deleteEventInDB = async (eventId, author) => {
    try {
        await remove(ref(db, `events/${eventId}`));

        const userSnapshot = await get(ref(db, `users/${author}`));
        if (userSnapshot.exists()) {
            const user = userSnapshot.val();
            if (user.events && user.events[eventId]) {
                await remove(ref(db, `users/${author}/events/${eventId}`));
            }
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};



export const editEventInDB = async (updatedEvent) => {
    try {
        const { id, name, description } = updatedEvent;
        const eventRef = ref(db, `events/${id}`);

        await update(eventRef, { name, description });
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
};

export const toggleUserRole = async (userId, currentRole) => {
    try {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';

        await update(ref(db, `users/${userId}`), { role: newRole });
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
};