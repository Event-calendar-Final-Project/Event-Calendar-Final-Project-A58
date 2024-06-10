import AddContact from '../AddContact/AddContact';
import { useState, useContext } from 'react';
import { fetchUsersFromDB } from '../../services/users.service';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export default function SearchUser( {onUserAdded} ) {
  const { userData } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [contactAdded, setContactAdded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const users = await fetchUsersFromDB();
    const searchResults = users.filter((user) => user.handle === query || user.email === query || user.phone === query);

    setResults(searchResults);
    console.log(searchResults);
    setContactAdded(false);

  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center mb-4 space-x-2">
          <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              className="w-48 border border-gray-300 px-4 py-2 rounded-md" 
              placeholder="Search users" 
          />
          <button 
              type="submit" 
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-blue-500"
          >
              Search
          </button>
      </form>

      {
        results && results[0] && (
          <div>
            <h2>
              <Link to={{
                pathname: `/${results[0].handle}`,
                state: { user: results[0] }
              }}>
                 {console.log('Link state:', { user: results[0] })}
                {results[0].handle}
              </Link>
            </h2>
            <p>Email: {results[0].email}</p>
            <p>Phone: {results[0].phone}</p>
            <p>Address: {results[0].address}</p>
            <AddContact handle={userData.handle} contactHandle={results[0].handle} contactAdded={contactAdded} setContactAdded={setContactAdded} onUserAdded={onUserAdded} />
          </div>
        )
      }
    </div>
  );
}