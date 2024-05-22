import React, { useState } from 'react';
import { fetchUsersFromDB } from '../../services/users.service';

export default function SearchUser() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Call the fetch function with the search query
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
        <div>
          <h2>{results[0].handle}</h2>
          <p>{results[0].email}</p>
        </div>
      }
    </div>
  );
}

