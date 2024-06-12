import { useEffect, useState } from 'react';
import { getUserContactsList, addContactToUser } from '../../services/users.service';
import PropTypes from 'prop-types';

export default function AddContact({ handle, contactHandle, contactAdded, setContactAdded, onUserAdded }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    getUserContactsList(handle).then(setContacts);
  }, [handle]);

  const handleAddContactSubmit = (event) => {
    event.preventDefault();
    addContactToUser(handle, contactHandle).then(() => setContactAdded(true));
    onUserAdded();

  }

  return (
    contacts && Object.keys(contacts).includes(contactHandle) || contactAdded ? null : <button onClick={handleAddContactSubmit}>Add Contact</button>
  )
}

AddContact.propTypes = {
  handle: PropTypes.string.isRequired,
  contactHandle: PropTypes.string.isRequired,
  contactAdded: PropTypes.bool.isRequired,
  setContactAdded: PropTypes.func.isRequired,
  onUserAdded: PropTypes.func.isRequired
};