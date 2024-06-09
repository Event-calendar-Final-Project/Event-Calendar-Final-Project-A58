import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchUserByHandle } from "../../services/users.service";
import { Link } from 'react-router-dom';

export default function MyContactsList({ myContacts }) {

    return (
        <div>
            <h1>My Contacts</h1>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px'
            }}>
                {myContacts.map((contact) => (
                    <div key={contact.uid} style={{
                        border: '1px solid #ccc',
                        padding: '20px',
                        borderRadius: '5px'
                    }}>
                        <h2>
                            <Link to={{
                                pathname: `/${contact.handle}`,
                                state: { user: contact }
                            }}>
                                {contact.handle}
                            </Link>
                        </h2>
                        <p>Email: {contact.email}</p>
                        <p>Phone: {contact.phone}</p>
                        <p>Address: {contact.address}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}