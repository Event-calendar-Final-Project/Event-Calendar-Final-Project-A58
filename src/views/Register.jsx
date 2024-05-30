import { useContext, useState } from "react"
import { registerUser } from "../services/auth.service";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle } from "../services/users.service";

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    photo: null,
    address: '',
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
      const credential = await registerUser(form.email, form.password);
      await createUserHandle(form.username, credential.user.uid, credential.user.email, form.firstName, form.lastName, form.photo, form.address);
      setAppState({ user: credential.user, userData: null });
      navigate('/');
    } catch (error) {
      if (error.message.includes('auth/email-already-in-use')) {
        console.log('User has already been registered!');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-12 rounded-md shadow-md" style={{ width: '400px' }}>
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
        <label htmlFor="photo" className="block mb-2">Photo:</label>
        <input onChange={e => setForm({...form, photo: e.target.files[0]})} type="file" name="photo" id="photo" className="w-full px-3 py-2 border rounded-md" />
        <br /> <br /><br />
        <div className="flex justify-center"><button onClick={register} className="px-4 py-2 text-white bg-blue-500 rounded-md">Register</button></div>
      </div>
    </div>
  );
}