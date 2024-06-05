import { useContext, useState } from "react"
import { registerUser } from "../services/auth.service";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle } from "../services/users.service";
import { addUserPhoto } from "../services/upload.service";
import PhotoPreview from "../components/PhotoPreview/PhotoPreview";

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    photo: null,
    address: '',
    phone: '', 
  });
  const { user, setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  if (user) {
    navigate('/');
  }

  const updateForm = prop => e => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const register = async() => {
    // TODO: validate form data
    try {
      const user = await getUserByHandle(form.username);
      if (user.exists()) {
        return console.log('User with this username already exists!');
      }
      let photoUrl = '';
      if (form.photo) {
        photoUrl = await addUserPhoto(form.photo, form.username);
      }
      const credential = await registerUser(form.email, form.password);
      await createUserHandle(form.username, credential.user.uid, credential.user.email, form.firstName, form.lastName, photoUrl, form.address, form.phone); // use the photoUrl here
      setAppState({ user: credential.user, userData: null });
      navigate('/');
    } catch (error) {
      if (error.message.includes('auth/email-already-in-use')) {
        console.log('User has already been registered!');
      }
    }
  };

  return (
    <>
          <section className="relative h-screen flex flex-col items-center justify-center text-center text-white" style={{ zIndex: 1 }}>
        <div className="video-docker absolute top-0 left-0 w-full h-full overflow-hidden">
          <video className="min-w-full min-h-full absolute object-cover"
            src="https://cdn.pixabay.com/video/2017/01/26/7529-201118756_large.mp4"
            type="video/mp4" autoPlay muted loop></video>
        </div>
        <div className="video-content space-y-2 z-10">
          <h1 className="font-light text-6xl"></h1>
          <h3 className="font-light text-3xl"></h3>
        </div>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-black p-12 rounded-md shadow-md" style={{ width: '400px', zIndex: 10 }}>
          <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
          <label htmlFor="username" className="block mb-2">Username:</label>
          <input value={form.username} onChange={updateForm('username')} type="text" name="username" id="username" className="w-full px-3 py-2 border rounded-md" />
          <label htmlFor="firstName" className="block mb-2">First Name:</label>
          <input value={form.firstName} onChange={updateForm('firstName')} type="text" name="firstName" id="firstName" className="w-full px-3 py-2 border rounded-md" />
          <label htmlFor="lastName" className="block mb-2">Last Name:</label>
          <input value={form.lastName} onChange={updateForm('lastName')} type="text" name="lastName" id="lastName" className="w-full px-3 py-2 border rounded-md" />
          <label htmlFor="email" className="block mb-2">Email:</label>
          <input value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" className="w-full px-3 py-2 border rounded-md" />
          <label htmlFor="password" className="block mb-2">Password:</label>
          <input value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" className="w-full px-3 py-2 border rounded-md" />
          <label htmlFor="address" className="block mb-2">Address:</label>
          <input value={form.address} onChange={updateForm('address')} type="text" name="address" id="address" className="w-full px-3 py-2 border rounded-md" />
          <label htmlFor="phone" className="block mb-2">Phone:</label>
          <input value={form.phone} onChange={updateForm('phone')} type="tel" name="phone" id="phone" className="w-full px-3 py-2 border rounded-md" /> {/* added phone field */}
          <label htmlFor="photo" className="block mb-2">Photo:</label>
          <input onChange={e => setForm({...form, photo: e.target.files[0]})} type="file" name="photo" id="photo" className="w-full px-3 py-2 border rounded-md" />
          <br /> <br /><br />
          <div className="flex justify-center"><button onClick={register} className="px-4 py-2 text-white bg-blue-500 rounded-md">Register</button></div>
          <PhotoPreview photo={form.photo} />
        </div>
      </div>

      </section>
    </>
  );
}