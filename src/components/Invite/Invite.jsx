import{ useState } from 'react';
import InviteUser from '../InviteUser/InviteUser';
import InviteContactList from '../InviteContactList/InviteContactList';

export default function Invite({ initialEvent, onUserAdded }) {

  const [showInviteOptions, setShowInviteOptions] = useState(false);

  return (
    <div>
      {!showInviteOptions && (
        <button
          className="btn btn-primary"
          onClick={() => setShowInviteOptions(true)}
        >
          Invite
        </button>
      )}
      {showInviteOptions && (
        <div className="flex flex-col gap-2">
            {<InviteUser initialEvent={initialEvent} onUserAdded={onUserAdded}/>}
            {<InviteContactList initialEvent={initialEvent} onUserAdded={onUserAdded}/>}
        </div>
      )}
    </div>
  );
};
