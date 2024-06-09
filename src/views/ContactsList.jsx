import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import SearchUser from "../components/SearchUser/SearchUser";
import MyContactsList from "../components/MyContactsList/MyContactsList";
import ContactsLists from "../components/ContactsLists/ContactsLists";
import { fetchUserByHandle } from "../services/users.service";
import { getUserContactsList } from "../services/users.service";


export default function ContactsList() {
  const { userData } = useContext(AppContext);
  const [selectedOption, setSelectedOption] = useState('myContacts');
  const[myContacts, setMyContacts] = useState([]);
  const [triggerRerender, setTriggerRerender] = useState(false);

  const handleUserAdded = () => {
    setTriggerRerender(prevState => !prevState);
  }; 

  useEffect(() => {
    
    getUserContactsList(userData.handle)
      .then(contacts => {
        if (contacts) {
          const contactHandles = Object.keys(contacts);
          return Promise.all(contactHandles.map(handle => fetchUserByHandle(handle)));
        }
        return [];
      })
      .then(setMyContacts)
      .catch(error => console.error("Failed to fetch contacts:", error));
  }, [userData.handle, triggerRerender]); 

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value); 
  };

  return (
    <>
      <select onChange={handleSelectChange} value={selectedOption}>
        <option value="myContacts">My Contacts</option>
        <option value="contactsLists">Contacts Lists</option>
      </select>
      {selectedOption === 'myContacts' && (
        <>
          <SearchUser onUserAdded={handleUserAdded} />
          <MyContactsList myContacts={myContacts}/>
        </>
      )}
      {selectedOption === 'contactsLists' && <ContactsLists />}
    </>
  );
}