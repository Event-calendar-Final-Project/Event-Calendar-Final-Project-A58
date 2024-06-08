import React from 'react';

export default function InviteContactList({ contactListName, setContactListName, inviteContactList, error }){
  return (
    <div>
      {/* Input and button for inviting users from a contact list */}
      <input
        value={contactListName}
        onChange={(e) => setContactListName(e.target.value)}
        placeholder="Contact list name"
      />
      <button onClick={inviteContactList}>Invite Contact List</button>
      {error && <p>{error}</p>}
    </div>
  );
};

