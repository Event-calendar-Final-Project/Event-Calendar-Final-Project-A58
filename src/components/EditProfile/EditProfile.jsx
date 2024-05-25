import { useState } from 'react';
import { updateUserProfile } from '../../services/users.service';

export default function EditProfile({ user }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [avatar, setAvatar] = useState(user.avatar);
  const [isSuccessful, setIsSuccessful] = useState(false); 


  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await updateUserProfile(user.handle, firstName, lastName, phone, address, avatar);
    if (result.success) {
      setIsSuccessful(true);
      setFirstName('');
      setLastName('');
      setPhone('');
      setAddress('');
      setAvatar('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {isSuccessful && <p>Profile updated successfully!</p>}
      <label>
        First Name:
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </label>
      <label>
        Last Name:
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </label>
      <label>
        Phone:
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>
      <label>
        Address:
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </label>
      <label>
        Avatar URL:
        <input type="url" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}