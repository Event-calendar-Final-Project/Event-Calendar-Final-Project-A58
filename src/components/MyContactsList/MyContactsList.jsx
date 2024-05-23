import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { getUserContactsList } from "../../services/users.service";


export default function MyContactsList() {

    const[myContacts, setMyContacts] = useState([]);
    const { userData } = useContext(AppContext);
    console.log(userData);
    console.log(myContacts);
    useEffect(() => {
        getUserContactsList(userData.handle).then(setMyContacts);
    }), [];

    return (
        <div>
            <h1>My Contacts</h1>
            <ul>
                {myContacts.map((contact) => (
                    <li key={contact.uid}>{contact.handle}</li>
                ))}
            </ul>
        </div>
    )
}