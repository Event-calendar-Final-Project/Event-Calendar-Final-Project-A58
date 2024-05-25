import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import SearchUser from "../components/SearchUser/SearchUser";
import MyContactsList from "../components/MyContactsList/MyContactsList";

export default function ContactsList() {
  const { userData } = useContext(AppContext);
  const [selectedOption, setSelectedOption] = useState('myContacts'); // State to track the selected option in the dropdown menu

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value); // Set selectedOption to the selected value when the dropdown menu changes
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