import AddContact from '../AddContact/AddContact';
import { useState, useContext } from 'react';
import { fetchUsersFromDB } from '../../services/users.service';
import { AppContext } from '../../context/AppContext';

export default function SearchUser() {
  const { userData } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [contactAdded, setContactAdded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const users = await fetchUsersFromDB();
    const searchResults = users.filter((user) => user.handle === query);

    setResults(searchResults);
    console.log(searchResults);
    setContactAdded(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {
  results && (
    <div>
      <h2>{results[0].handle}</h2>
      <p>{results[0].email}</p>
      <AddContact handle={userData.handle} contactHandle={results[0].handle} contactAdded={contactAdded} setContactAdded={setContactAdded} />
    </div>
  )
}
    </div>
  );
}

