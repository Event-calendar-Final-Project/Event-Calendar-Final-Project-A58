import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchUserByHandle } from "../../services/users.service";


export default function MyContactsList() {

    const[myContacts, setMyContacts] = useState([]);
    const { userData } = useContext(AppContext);

    useEffect(() => {
        const contacts = Object.keys(userData.contacts || {});
        Promise.all(contacts.map((handle) => fetchUserByHandle(handle)))
            .then(setMyContacts);
    }, [userData.contacts]); 

    console.dir(myContacts);

    return (
        <div>
            <h1>My Contacts</h1>
            <ul>
                {myContacts.map((contact) => (
                    <li key={contact.uid}>{contact.handle} {contact.email}</li>
                ))}
            </ul>
        </div>
    )
}