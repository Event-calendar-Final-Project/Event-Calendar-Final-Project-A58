import{ useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import InviteUser from '../InviteUser/InviteUser';
import InviteContactList from '../InviteContactList/InviteContactList';
import { fetchContactLists, getUserContactsList } from '../../services/users.service';
import { inviteUser } from '../../services/event.service';

export default function Invite({ initialEvent }) {

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
            {<InviteUser initialEvent={initialEvent}/>}
            {<InviteContactList initialEvent={initialEvent}/>}
        </div>
      )}
    </div>
  );
};
