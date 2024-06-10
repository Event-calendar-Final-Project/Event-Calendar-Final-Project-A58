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
  const [errors, setErrors] = useState({});
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

  const validateForm = async () => {
    const newErrors = {};
    const usernameRegex = /^[a-zA-Z0-9]{3,30}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/;
    const nameRegex = /^[a-zA-Z]{1,30}$/;
    const phoneRegex = /^\d{10}$/;

    if (!form.username || !usernameRegex.test(form.username)) {
      newErrors.username = 'Username must be between 3 and 30 alphanumeric characters.';
    } else {
      const user = await getUserByHandle(form.username);
      if (user.exists()) {
        newErrors.username = 'Username already exists.';
      }
    }

    if (!form.email || !emailRegex.test(form.email)) {
      newErrors.email = 'Invalid email address.';
    }

    if (!form.password || !passwordRegex.test(form.password)) {
      newErrors.password = 'Password must be 8-30 characters and include at least one number and one symbol.';
    }

    if (!form.firstName || !nameRegex.test(form.firstName)) {
      newErrors.firstName = 'First name must be 1-30 characters and contain only letters.';
    }

    if (!form.lastName || !nameRegex.test(form.lastName)) {
      newErrors.lastName = 'Last name must be 1-30 characters and contain only letters.';
    }

    if (!form.phone || !phoneRegex.test(form.phone)) {
      newErrors.phone = 'Phone number must be 10 digits.';
    }

    if (!form.photo) {
      newErrors.photo = 'Photo is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register = async () => {
    if (!(await validateForm())) {
      return;
    }

    try {
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
        setErrors({ email: 'Email already registered.' });
      }
    }
  };

  return (
    <>
      <section className="relative h-screen flex items-center justify-center text-center text-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <video className="flex min-w-full min-h-full object-cover"
            src="https://cdn.pixabay.com/video/2017/01/26/7529-201118756_large.mp4"
            type="video/mp4" autoPlay muted loop></video>
        </div>
        <div className="relative bg-black bg-opacity-75 p-8 rounded-md shadow-md w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
          {errors.form && (
            <div className="alert alert-error shadow-lg mb-4">
              <div>{errors.form}</div>
            </div>
          )}
          <label htmlFor="username" className="block mb-2">Username:</label>
          <input value={form.username} onChange={updateForm('username')} type="text" name="username" id="username" className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`} />
          {errors.username && <div className="text-red-500">{errors.username}</div>}

          <label htmlFor="firstName" className="block mb-2">First Name:</label>
          <input value={form.firstName} onChange={updateForm('firstName')} type="text" name="firstName" id="firstName" className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`} />
          {errors.firstName && <div className="text-red-500">{errors.firstName}</div>}

          <label htmlFor="lastName" className="block mb-2">Last Name:</label>
          <input value={form.lastName} onChange={updateForm('lastName')} type="text" name="lastName" id="lastName" className={`input input-bordered w-full ${errors.lastName ? 'input-error' : ''}`} />
          {errors.lastName && <div className="text-red-500">{errors.lastName}</div>}

          <label htmlFor="email" className="block mb-2">Email:</label>
          <input value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`} />
          {errors.email && <div className="text-red-500">{errors.email}</div>}

          <label htmlFor="password" className="block mb-2">Password:</label>
          <input value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`} />
          {errors.password && <div className="text-red-500">{errors.password}</div>}

          <label htmlFor="address" className="block mb-2">Address:</label>
          <input value={form.address} onChange={updateForm('address')} type="text" name="address" id="address" className="input input-bordered w-full" />

          <label htmlFor="phone" className="block mb-2">Phone:</label>
          <input value={form.phone} onChange={updateForm('phone')} type="tel" name="phone" id="phone" className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`} />
          {errors.phone && <div className="text-red-500">{errors.phone}</div>}

          <label htmlFor="photo" className="block mb-2">Photo:</label>
          <input onChange={e => setForm({ ...form, photo: e.target.files[0] })} type="file" name="photo" id="photo" className={`input input-bordered w-full ${errors.photo ? 'input-error' : ''}`} />
          {errors.photo && <div className="text-red-500">{errors.photo}</div>}

          <div className="mt-4 flex justify-center">
            <button onClick={register} className="btn btn-primary">Register</button>
          </div >
          <div className="flex justify-center">
            <PhotoPreview photo={form.photo} />
          </div>
        </div>
      </section>
    </>
  );
}