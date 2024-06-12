import AddContact from '../AddContact/AddContact';
import { useState, useContext } from 'react';
import { fetchUsersFromDB } from '../../services/users.service';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function SearchUser( {onUserAdded} ) {
  const { userData } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [contactAdded, setContactAdded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try{
      const users = await fetchUsersFromDB();
      const searchResults = users.filter((user) => user.handle === query || user.email === query || user.phone === query);

      setResults(searchResults);
      console.log(searchResults);
      setContactAdded(false);
    } catch (error) { console.error('Error searching for user:', error); }

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

      <tbody className="text-gray-500">
              {results && results[0] && (
                <tr>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <p className="whitespace-no-wrap">1</p>
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <Link to={{
                      pathname: `/${results[0].handle}`,
                      state: { user: results[0] }
                    }}>
                      {results[0].handle}
                    </Link>
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {results[0].email}
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {results[0].phone}
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {results[0].address}
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <AddContact handle={userData.handle} contactHandle={results[0].handle} contactAdded={contactAdded} setContactAdded={setContactAdded} onUserAdded={onUserAdded} />
                  </td>
                </tr>
              )}
            </tbody>
    </div>
  ); 
}

SearchUser.propTypes = {
  onUserAdded: PropTypes.func.isRequired
};