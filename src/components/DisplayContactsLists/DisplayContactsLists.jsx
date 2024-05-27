import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export default function DisplayContactsLists({ contactLists }) {
  const { userData } = useContext(AppContext);

  return (
    <div>
      <h1>My Contacts Lists</h1>
      {userData.contactLists && (contactLists.map((list) => (
        <div key={list}>
          <h2>{list}</h2>
        </div>
      )))}
    </div>
  );
}