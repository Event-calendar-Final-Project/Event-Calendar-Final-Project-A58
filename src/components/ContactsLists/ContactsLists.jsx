import CreateContactLists from "../CreateContactsLists/CreateContactLists";
import DisplayContactsLists from "../DisplayContactsLists/DisplayContactsLists";
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { fetchContactLists } from '../../services/users.service';

export default function ContactsLists() {
    const { userData } = useContext(AppContext);
    const [contactLists, setContactLists] = useState([]);
    const [listUpdateTrigger, setListUpdateTrigger] = useState(false);

    useEffect(() => {
        fetchContactLists(userData.handle).then(setContactLists);
    }, [userData, listUpdateTrigger]);

    return (
        <div>
            <h1>Contacts List</h1>
            <CreateContactLists onNewListAdded={(newList) => {
                setContactLists(prevLists => [...prevLists, newList]);
                setListUpdateTrigger(trigger => !trigger); 
            }} />
            <DisplayContactsLists contactLists={contactLists} />
        </div>
    );
}