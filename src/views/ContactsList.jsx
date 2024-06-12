import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import SearchUser from "../components/SearchUser/SearchUser";
import MyContactsList from "../components/MyContactsList/MyContactsList";
import ContactsLists from "../components/ContactsLists/ContactsLists";
import { fetchUserByHandle } from "../services/users.service";
import { getUserContactsList } from "../services/users.service";
import { ContactTypes } from "../Data/data-enums";

export default function ContactsList() {
  const { userData } = useContext(AppContext);
  const [selectedOption, setSelectedOption] = useState(ContactTypes.MY_CONTACTS);
  const [myContacts, setMyContacts] = useState([]);
  const [triggerRerender, setTriggerRerender] = useState(false);

  const handleUserAdded = () => {
    setTriggerRerender(prevState => !prevState);
  };

  useEffect(() => {
    if (userData && userData.handle) {
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
    }
  }, [userData, triggerRerender]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
      <div className="bg-white shadow-md rounded-md p-6" style={{ width: '900px', height: '700px' }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Contacts</h1>
          <div className="relative">
            <select
              onChange={handleSelectChange}
              value={selectedOption}
              className="block appearance-none border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring focus:border-blue-500 sm:text-sm"
            >
              <option value={ContactTypes.MY_CONTACTS}>My Contacts</option>
              <option value={ContactTypes.CONTACTS_LISTS}>Contacts Lists</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 8.707a1 1 0 011.414 0L10 10.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414zM7 4a1 1 0 100 2 1 1 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        {selectedOption === ContactTypes.MY_CONTACTS && (
          <>
            <SearchUser onUserAdded={handleUserAdded} />
            <MyContactsList myContacts={myContacts}/>
          </>
        )}
        {selectedOption === ContactTypes.CONTACTS_LISTS && <ContactsLists />}
      </div>
    </div>
  );
}