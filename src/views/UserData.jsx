import PropTypes from 'prop-types';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { fetchUserByHandle } from '../services/users.service';
import EditProfile from '../components/EditProfile/EditProfile';
import { AppContext } from '../context/AppContext';

export default function UserData({ user: userProp }) {
  const { handle } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(userProp || location.state?.user);
  const { userData } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div>
      <h1>{user.handle}</h1>
      <p>First Name: {user.firstName}</p>
      <p>Last Name: {user.lastName}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Address: {user.address}</p>
      {user.handle === userData.handle && <button onClick={handleEditClick}>Edit</button>} 
      {isEditing && <EditProfile user={user} />}
    </div>
  );
}

UserData.propTypes = {
  user: PropTypes.shape({
    handle: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
  }),
};