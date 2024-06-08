import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { getUserContactsList } from '../../services/users.service';
import { updateEvent } from '../../services/event.service';
import { AppContext } from '../../context/AppContext';

export default function InvitePermissions({ event }) {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showPermissions, setShowPermissions] = useState(false); // State to control visibility
  const { userData } = useContext(AppContext);

  useEffect(() => {
    getUserContactsList(userData.handle).then((contactsObject) => {
      const contactsArray = Object.keys(contactsObject);
      setContacts(contactsArray);
    });
  }, [userData.handle]);

  const invite = () => {
    const updatedEventData = {
      ...event,
      invitationPermission: [...(event.invitationPermission || []), ...selectedContacts],
    };
    updateEvent(event.id, updatedEventData).then(() => {
      setSelectedContacts([]);
      setShowPermissions(false); // Hide the permissions UI after updating
    });
  };

  return (
    userData.handle === event.author && (
      <div className="flex flex-col gap-2">
        {!showPermissions ? (
          <button onClick={() => setShowPermissions(true)} className="btn btn-xs btn-outline btn-success">
            Give Permissions
          </button>
        ) : (
          <>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedContacts([...selectedContacts, e.target.value]);
                }
              }}
              className="input input-bordered input-xs"
            >
              <option value="">Select a contact</option>
              {contacts.filter(contact => !selectedContacts.includes(contact) && (event.invitationPermission ? !event.invitationPermission.includes(contact) : true)).map((contact) => (
                <option key={contact} value={contact}>
                  {contact}
                </option>
              ))}
            </select>
            <ul>
              {selectedContacts.map((contact) => (
                <li key={contact}>
                  {contact}
                  <button onClick={() => setSelectedContacts(selectedContacts.filter(c => c !== contact))} className="btn btn-xs">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={invite} className="btn btn-xs btn-outline btn-success">
              Allow Invitations
            </button>
          </>
        )}
      </div>
    )
  );
}

InvitePermissions.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string,
    author: PropTypes.string.isRequired,
  }).isRequired,
};