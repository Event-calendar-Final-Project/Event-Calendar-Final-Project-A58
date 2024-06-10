import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { addContactList, fetchUserByHandle } from '../../services/users.service';

export default function CreateContactLists({ onNewListAdded }) {
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
    <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
      <button onClick={handleAddClick} class="block mb-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring">
        Add New Contact List
      </button>
      {isAdding && (
        <form onSubmit={handleFormSubmit} class="bg-white shadow-md rounded-md p-6">
        <div className="flex items-center mb-4">
          <label className="mr-4 text-sm font-medium text-gray-700">List Name:</label>
          <input 
            type="text" 
            value={listName} 
            onChange={(e) => setListName(e.target.value)} 
            className="flex-1 block border-2 border-blue-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
          />
        </div>
        {contactDetails.length > 0 && contactDetails.map((contact) => (
          <div key={contact.uid} className="flex items-center justify-between mb-2">
            <span>{contact.handle}</span>
            <input 
              type="checkbox" 
              onChange={(e) => handleCheckboxChange(e, contact)} 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
            />
          </div>
        ))}
        <button 
          type="submit" 
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
      )}
    </div>
  );
}
