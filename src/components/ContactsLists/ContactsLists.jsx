import CreateContactLists from "../CreateContactsLists/CreateContactLists";
import DisplayContactsLists from "../DisplayContactsLists/DisplayContactsLists";
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

export default function ContactsLists() {

    const { userData } = useContext(AppContext);
    const [contactLists, setContactLists] = useState([]);

    useEffect(() => {
        setContactLists(Object.keys(userData.contactLists));
      }, [userData.contactLists]);

    return (
        <div>
            <h1>Contacts List</h1>
            <CreateContactLists onNewListAdded={(newList) => setContactLists(prevLists => [...prevLists, newList])} />
            <DisplayContactsLists contactLists={contactLists} />
        </div>
    )
} 