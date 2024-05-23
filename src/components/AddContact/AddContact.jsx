import { addContactToUser } from "../../services/users.service"


export default function AddContact( { handle, uid } ) {

    const handleAddContactSubmit = (event) => {
        event.preventDefault();
        console.log(handle, uid)
        addContactToUser(handle, uid)
    }

    return (
        <button onClick={handleAddContactSubmit}>Add Contact</button>
    )
}