import React from 'react';

export default function InviteUser({ contacts, inviteHandle, setInviteHandle, invite }){
    console.log(contacts)
    return (
        <div className="flex flex-col gap-2">
          <input
            value={inviteHandle}
            onChange={(e) => setInviteHandle(e.target.value)}
            placeholder="User handle to invite"
            list="contacts-list"
            className="input input-bordered input-xs"
          />
          <datalist id="contacts-list">
            {contacts.map(contact => (
              <option key={contact} value={contact} />
            ))}
          </datalist>
          <button onClick={invite} className="btn btn-xs btn-outline btn-success">Invite User</button>
        </div>
      );
};

