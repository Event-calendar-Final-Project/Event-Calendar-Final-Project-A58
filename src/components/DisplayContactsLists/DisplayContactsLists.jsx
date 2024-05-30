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

  return (
    <div>
      <h1>My Contacts Lists</h1>
      {contactLists.map((list) => (
        <div key={list.name}>
          <h2 onClick={() => handleClick(list.name)}>{list.name}</h2>
          {selectedList === list.name && (
            <div>
              {list.users.map((userHandle) => (
                <p key={userHandle}>
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
  );
}