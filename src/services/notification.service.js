import { ref, onValue, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const setupInvitedUsersListener = (event, userData) => {
    const invitedUsersRef = ref(db, `events/${event.id}/invitedUsers`);
    onValue(invitedUsersRef, (snapshot) => {
        if (snapshot.exists()) {
            const invitedUsers = snapshot.val();
            if (userData.handle in invitedUsers && invitedUsers[userData.handle] === true) {
                console.log('Invited users:', invitedUsers);
                alert(`You have been invited to ${event.name}!`);

                const updates = {};
                updates[`events/${event.id}/invitedUsers/${userData.handle}`] = false;
                update(ref(db), updates)
                    .then(() => {
                        console.log(`Successfully updated invitedUser ${userData.handle} to false in event ${event.id}`);
                    })
                    .catch((error) => {
                        console.error('Error updating invitedUser:', error);
                    });
            }
        }
    });
};