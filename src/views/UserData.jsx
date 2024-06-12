import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
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
    setIsEditing(!isEditing);
  };

  const refreshUserData = async () => {
    console.log('refreshUserData called');
    const fetchedUser = await fetchUserByHandle(handle);
    setUser(prevUser => ({ ...prevUser, ...fetchedUser }));
  };

  return (
    <div className="relative flex items-center justify-left h-screen ml-80 mr-80">
      <div className="flex flex-col lg:card-side bg-base-100 shadow-xl w-full max-w-3xl p-8">
        <figure className="mb-4 lg:mb-0 lg:mr-8">
          {user.photo && <img src={user.photo} alt={`${user.handle}'s profile`} className="w-full h-auto rounded-lg" />}
        </figure>
        <div className="card-body">
          <h2 className="card-title">{user.handle}</h2>
          <p>First Name: {user.firstName}</p>
          <p>Last Name: {user.lastName}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Address: {user.address}</p>
          {user.handle === userData?.handle && (
            <div className="card-actions justify-end">
              <button onClick={handleEditClick} className="btn btn-primary">Edit</button>
            </div>
          )}
        {isEditing && (
          <div className="absolute top-0 right-0 lg:top-0 lg:right-80 lg:ml-0">
            <EditProfile user={user} onProfileUpdate={refreshUserData} />
          </div>
        )}
        </div>
      </div>
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