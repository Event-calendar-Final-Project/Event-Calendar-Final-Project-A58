import PropTypes from 'prop-types';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { fetchUserByHandle } from '../services/users.service';
import EditProfile from '../components/EditProfile/EditProfile';
import { AppContext } from '../context/AppContext';

export default function UserData({ user: userProp }) {
  const { handle: handleParam } = useParams();
  const { userData } = useContext(AppContext);
  const handle = handleParam || userData.handle;
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    console.log('useEffect triggered');
    console.log('UserData useEffect', handle, user, userProp);
    const fetchUser = async () => {
      const fetchedUser = await fetchUserByHandle(handle);
      setUser(fetchedUser);
    };
    fetchUser();
    console.log(user)
  }, [handle]);

  if (!user) {
    return null; 
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const refreshUserData = async () => {
    console.log('refreshUserData called');
    const fetchedUser = await fetchUserByHandle(handle);
    setUser(prevUser => ({ ...prevUser, ...fetchedUser }));
  };

  return (
    <div>
      <h1>{user.handle}</h1>
      {user.photo && <img src={user.photo} alt={`${user.handle}'s profile`} />}
      <p>First Name: {user.firstName}</p>
      <p>Last Name: {user.lastName}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Address: {user.address}</p>
      {user.handle === userData?.handle && <button onClick={handleEditClick}>Edit</button>}
      {isEditing && <EditProfile user={user} onProfileUpdate={refreshUserData} />}
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
    photo: PropTypes.string,
  }),
};