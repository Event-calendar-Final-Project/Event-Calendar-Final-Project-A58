import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { addContactList, fetchUserByHandle } from '../../services/users.service';

export default function CreateContactLists( { onNewListAdded }) { 
  const [isAdding, setIsAdding] = useState(false);
  const [listName, setListName] = useState('');
  const { userData: { contacts } } = useContext(AppContext);
  const { userData } = useContext(AppContext);
  const [contactDetails, setContactDetails] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState({});
  
  useEffect(() => {
    Promise.all(Object.keys(contacts).map((contact) => fetchUserByHandle(contact)))
      .then((details) => {
        console.log(details);
        setContactDetails(details);
      });
  }, [contacts]);
  console.log(contactDetails);


  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleCheckboxChange = (event, contact) => {
    if (event.target.checked) {
      setSelectedContacts(prevContacts => ({
        ...prevContacts,
        [contact.handle]: true
      }));
    } else {
      setSelectedContacts(prevContacts => {
        const newContacts = { ...prevContacts };
        delete newContacts[contact.handle];
        return newContacts;
      });
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const selectedContactHandles = Object.keys(selectedContacts);
    addContactList(userData.handle, listName, selectedContactHandles)
      .then(() => {
        onNewListAdded({ name: listName, users: selectedContactHandles });
      });
    setListName('');
    setSelectedContacts({});
    setIsAdding(false);
  };


  return (
    <div>
      <button onClick={handleAddClick}>Add New Contact List</button>
      {isAdding && (
        <form onSubmit={handleFormSubmit}>
          <label>
            List Name:
            <input type="text" value={listName} onChange={(e) => setListName(e.target.value)} />
          </label>
          {contactDetails.length > 0 && contactDetails.map((contact) => (
            <div key={contact.uid}>
              <span>{contact.handle}</span>
              <input type="checkbox" onChange={(e) => handleCheckboxChange(e, contact)} />
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}