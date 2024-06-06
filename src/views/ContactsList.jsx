import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import SearchUser from "../components/SearchUser/SearchUser";
import MyContactsList from "../components/MyContactsList/MyContactsList";
import ContactsLists from "../components/ContactsLists/ContactsLists";


export default function ContactsList() {
  const { userData } = useContext(AppContext);
  const [selectedOption, setSelectedOption] = useState('myContacts'); 

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value); 
  };

  return (
    <>
      <SearchUser />
      <select onChange={handleSelectChange}>
        <option value="myContacts">My Contacts</option>
        <option value="contactsLists">Contacts Lists</option>
      </select>
      {selectedOption === 'myContacts' && <MyContactsList />}
      {selectedOption === 'contactsLists' && <ContactsLists />}
    </>
  );
}