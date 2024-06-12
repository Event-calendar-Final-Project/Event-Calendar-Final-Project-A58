import { ref, onValue, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { getEventById } from './event.service';

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

export const setupEventSeriesListener = (seriesId, userData) => {
    const seriesRef = ref(db, `eventSeries/${seriesId}`);
    onValue(seriesRef, (snapshot) => {
      const seriesData = snapshot.val();
      const endDate = seriesData.endDate;
      if (endDate === '') {
        
        const eventIds = seriesData.events; 
        if (eventIds) {
            const eventId = Object.keys(eventIds)[0];
            
            getEventById(eventId).then(eventData => {
              
              console.log(eventData);
              
            }).catch(error => {
              console.error('Error fetching event data:', error);
            });
          }
      }
      else {
        console.log('enddate')
      }
    });
  };