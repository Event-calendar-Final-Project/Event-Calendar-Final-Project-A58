import{ useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import InviteUser from '../InviteUser/InviteUser';
import InviteContactList from '../InviteContactList/InviteContactList';
import { fetchContactLists, getUserContactsList } from '../../services/users.service';
import { get } from 'firebase/database';

export default function Invite({ initialEvent }) {
  const { userData } = useContext(AppContext);
  const [showInviteOptions, setShowInviteOptions] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactLists, setContactLists] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const contactLists = await fetchContactLists(userData.handle);
        setContactLists(Object.keys(contactLists));
        const contacts = await getUserContactsList(userData.handle);
        setContacts(Object.keys(contacts));
        console.log(contacts);
        console.log(contactLists);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    fetchData();
  }, [userData.handle])

  return (
    <div>
      {!showInviteOptions && (
        <button
          className="btn btn-primary"
          onClick={() => setShowInviteOptions(true)}
        >
          Invite
        </button>
      )}
      {showInviteOptions && (
        <div className="flex flex-col gap-2">
            {contacts && <InviteUser contacts={contacts}/>}
        </div>
      )}
    </div>
  );
};
