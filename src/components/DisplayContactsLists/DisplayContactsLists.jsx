import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DisplayContactsLists({ contactLists }) {
  const [selectedList, setSelectedList] = useState(null);

  const handleClick = (list) => {
    if (selectedList === list) {
      setSelectedList(null);
    } else {
      setSelectedList(list);
    }
  };

  const listStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
  };

  const nameStyle = {
    border: '1px solid black',
    padding: '10px',
    cursor: 'pointer',
  };
console.log(contactLists);
  return (
    <div>
      <h1>My Contacts Lists</h1>
      <div style={listStyle}>
        {contactLists.map((list) => (
          <div key={list.users.id}>
            <h2 style={nameStyle} onClick={() => handleClick(list.users.listName)}>{list.users.listName}</h2>
            {selectedList === list.users.listName && (
  <div>
{list.users.contacts.map((userHandle, index) => (
  <p key={`${list.users.id}-${userHandle}-${index}`}>
    <Link to={`/${userHandle}`}>
      {userHandle}
    </Link>
  </p>
))}
  </div>
)}
          </div>
        ))}
      </div>
    </div>
  );
}