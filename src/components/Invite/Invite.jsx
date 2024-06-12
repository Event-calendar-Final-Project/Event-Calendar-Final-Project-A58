import{ useState } from 'react';
import InviteUser from '../InviteUser/InviteUser';
import InviteContactList from '../InviteContactList/InviteContactList';
import PropTypes from 'prop-types';

export default function Invite({ initialEvent, onUserAdded }) {

  const [showInviteOptions, setShowInviteOptions] = useState(false);

  return (
    <div>
      {!showInviteOptions && (
        <button
          className="btn min-w-auto w-32 h-10 bg-green-300 p-2 rounded-t-xl hover:bg-green-500 text-white font-semibold transition-transform hover:-translate-y-2 ease-in-out"
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
}

Invite.propTypes = {
  initialEvent: PropTypes.object.isRequired,
  onUserAdded: PropTypes.func.isRequired,
};
