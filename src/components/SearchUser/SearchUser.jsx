import { useState } from 'react';
import { fetchUsersFromDB } from '../../services/users.service';

export default function SearchUser() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const users = await fetchUsersFromDB();
    const searchResults = users.filter((user) => user.handle === query);

    setResults(searchResults);
    console.log(searchResults);
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
    </div>
  )
}
    </div>
  );
}

