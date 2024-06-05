import {  useState } from 'react';
import {  updateUserProfile } from '../../services/users.service';
import { updateUserPhoto } from '../../services/upload.service';
import PhotoPreview from '../PhotoPreview/PhotoPreview';


export default function EditProfile({ user, onProfileUpdate }) {

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [photo, setPhoto] = useState(user.photo);
  const [isSuccessful, setIsSuccessful] = useState(false); 


console.log(user);
  const handleSubmit = async (event) => {
    let photoUrl = '';
    event.preventDefault();
        if (photo) {
          console.log(user.photo)
      const upload = await updateUserPhoto(photo, user.handle, user.photo);
    
      console.dir(upload.downloadURL);
      photoUrl = upload.downloadURL;
     
    }
    const result = await updateUserProfile(user.handle, firstName, lastName, phone, address, photoUrl);
    if (result.success) {
      setIsSuccessful(true);
      setFirstName('');
      setLastName('');
      setPhone('');
      setAddress('');
      setPhoto('');
      console.log('Calling onProfileUpdate');
      onProfileUpdate();
    }
  };



  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-12 rounded-md shadow-md" style={{ width: '400px' }}>
        <h1 className="text-2xl font-bold mb-4 text-center">Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          {isSuccessful && <p>Profile updated successfully!</p>}
          <label htmlFor="firstName" className="block mb-2">First Name:</label>
          <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          <label htmlFor="lastName" className="block mb-2">Last Name:</label>
          <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          <label htmlFor="phone" className="block mb-2">Phone:</label>
          <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          <label htmlFor="address" className="block mb-2">Address:</label>
          <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          <label htmlFor="photo" className="block mb-2">Photo:</label>
          <input id="photo" type="file" onChange={(e) => setPhoto(e.target.files[0])} className="w-full px-3 py-2 border rounded-md" />
          <br /><br />
          <div className="flex justify-center">
            <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-md">Submit</button>
            <PhotoPreview photo={photo} />
          </div>
        </form>
      </div>
    </div>
  );
}