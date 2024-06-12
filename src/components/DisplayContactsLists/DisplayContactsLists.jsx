import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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
    <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
      <h1 className="text-2xl font-bold mb-4 text-center">My Contacts Lists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {contactLists.map((list) => (
          <div key={list.users.id} className="bg-white rounded-md shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2 cursor-pointer" onClick={() => handleClick(list.users.listName)}>{list.users.listName}</h2>
            {selectedList === list.users.listName && (
              <div>
                {list.users.contacts.map((userHandle, index) => (
                  <p key={`${list.users.id}-${userHandle}-${index}`}>
                    <Link to={`/${userHandle}`} class="text-blue-600 font-bold hover:underline">
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

DisplayContactsLists.propTypes = {
  contactLists: PropTypes.arrayOf(
    PropTypes.shape({
      users: PropTypes.shape({
        id: PropTypes.string,
        listName: PropTypes.string,
        contacts: PropTypes.arrayOf(PropTypes.string),
      }).isRequired,
    }).isRequired
  ).isRequired,
};