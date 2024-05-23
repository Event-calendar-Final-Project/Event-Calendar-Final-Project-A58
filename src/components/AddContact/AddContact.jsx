import { useEffect, useState } from 'react';
import { getUserContactsList, addContactToUser } from '../../services/users.service';

export default function AddContact({ handle, contactHandle, contactAdded, setContactAdded }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    getUserContactsList(handle).then(setContacts);
  }, [handle]);

  const handleAddContactSubmit = (event) => {
    event.preventDefault();
    addContactToUser(handle, contactHandle).then(() => setContactAdded(true)); 
  }

  return (
    contacts && Object.keys(contacts).includes(contactHandle) || contactAdded ? null : <button onClick={handleAddContactSubmit}>Add Contact</button>
  )
}