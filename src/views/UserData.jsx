import PropTypes from 'prop-types';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserByHandle } from '../services/users.service';

export default function UserData({ user: userProp }) {
  const { handle } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(userProp || location.state?.user);

  useEffect(() => {
    console.log('UserData useEffect', handle, user, userProp);
    const fetchUser = async () => {
      if (!user || (userProp && userProp.handle !== user.handle)) {
        const fetchedUser = userProp || await fetchUserByHandle(handle);
        setUser(fetchedUser);
      }
    };
    console.log(handle)
    fetchUser();
  }, [handle, user, userProp]);

  if (!user) {
    return null; 
  }

  return (
    <div>
      <h1>{user.handle}</h1>
      <p>{user.email}</p>
    </div>
  );
}

UserData.propTypes = {
  user: PropTypes.shape({
    handle: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
};