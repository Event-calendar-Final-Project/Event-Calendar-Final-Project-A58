import { useState, useEffect, useContext } from "react";
import { getUserContactsList } from "../../services/users.service";
import { getInvitedUsers, inviteUser } from "../../services/event.service"; 
import { AppContext } from "../../context/AppContext";

export default function InviteUser({ initialEvent, onUserAdded }) {
  const [contacts, setContacts] = useState([]);
  const [inviteHandle, setInviteHandle] = useState("");
  const [availableContacts, setAvailableContacts] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState(""); 
  const { userData } = useContext(AppContext);
  const [inputKey, setInputKey] = useState(0);
  const [invitedUsers, setInvitedUsers] = useState([]);

  useEffect(() => {
    
    getUserContactsList(userData.handle).then(fetchedContacts => {
      const contactsArray = Object.keys(fetchedContacts);
      setContacts(contactsArray);
  
      
      getInvitedUsers(initialEvent.id).then((invited) => {
        setInvitedUsers(invited);
  
        
        const filteredContacts = contactsArray.filter(contact => !invited.includes(contact));
        setAvailableContacts(filteredContacts);
      });
    });
  }, [userData.handle, initialEvent.id]);

  const handleInviteClick = async () => {
    if (!inviteHandle) {
      setFeedbackMessage("Please enter a user handle to invite.");
      return;
    }
    if (!availableContacts.includes(inviteHandle)) {
      setFeedbackMessage("Selected user is not in your contacts or already invited.");
      return;
    }
    try {
      await inviteUser(initialEvent.id, inviteHandle);
      setFeedbackMessage("Invitation sent successfully!");
      setAvailableContacts(availableContacts.filter(contact => contact !== inviteHandle));
      setInviteHandle("");
      setInputKey(prevKey => prevKey + 1);
      onUserAdded();
    } catch (error) {
      setFeedbackMessage("Failed to send invitation. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        key={inputKey}
        value={inviteHandle}
        onChange={(e) => setInviteHandle(e.target.value)}
        placeholder="User handle to invite"
        list="contacts-list"
        className="input input-bordered input-xs"
      />
      <datalist id="contacts-list">
        {availableContacts.map(contact => (
          <option key={contact} value={contact} />
        ))}
      </datalist>
      <button onClick={handleInviteClick} className="btn btn-xs btn-outline btn-success">Invite User</button>
      {feedbackMessage && <p>{feedbackMessage}</p>}
    </div>
  );
}