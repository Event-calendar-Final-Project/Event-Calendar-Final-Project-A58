import { addContactToUser } from "../../services/users.service"
import { getUserContactsList } from "../../services/users.service";
import { useEffect, useState } from "react";


export default function AddContact( { handle, uid } ) {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        getUserContactsList(handle).then(setContacts);
    }, []);
    console.log(contacts)
    const handleAddContactSubmit = (event) => {
        event.preventDefault();
        console.log(handle, uid)
        addContactToUser(handle, uid)
    }

    return (
        Object.keys(contacts).includes(uid) ? null : <button onClick={handleAddContactSubmit}>Add Contact</button>
    )
}