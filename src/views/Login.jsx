import { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { loginUser } from "../services/auth.service";


export default function Login() {
  const { user, userData, setAppState } = useContext(AppContext);
  const [form, setForm] = useState({
      email: '',
      password: '',
  });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      if (user) {
          navigate(location.state?.from.pathname || '/');
      }
  }, [user, navigate, location.state?.from.pathname]);

  const validateForm = () => {
      let isValid = true;
      setEmailError(false);
      setPasswordError(false);

      if (!form.email) {
          setEmailError(true);
          isValid = false;
      }

      if (!form.password) {
          setPasswordError(true);
          isValid = false;
      }

      return isValid;
  };

  const login = async () => {
      if (!validateForm()) {
          setError('Please fill in all fields.');
          return;
      }

      try {
          const { user } = await loginUser(form.email, form.password);
          setAppState({ user, userData: null });
          navigate(location.state?.from.pathname || '/');
      } catch (error) {
          setError('Invalid email or password');
      }
  };

  const updateForm = prop => e => {
      setForm({
          ...form,
          [prop]: e.target.value,
      });
  };

  return (
      <>
          <section className="relative h-screen flex flex-col items-center justify-center text-center text-white" style={{ zIndex: 1 }}>
              <div className="video-docker absolute top-0 left-0 w-full h-full overflow-hidden">
                  <video className="min-w-full min-h-full absolute object-cover"
                      src="https://cdn.pixabay.com/video/2017/05/10/9085-217588573_large.mp4"
                      type="video/mp4" autoPlay muted loop></video>
              </div>
              <div className="video-content space-y-2 z-10">
                  <div className="flex justify-center items-center h-screen">
                      <div className="bg-black p-12 rounded-md shadow-md" style={{ width: '400px', zIndex: 10 }}>
                          <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
                          <label htmlFor="email" className="block mb-2">Email:</label>
                          <input value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" className={`w-full px-3 py-2 border rounded-md ${emailError ? 'border-red-500' : ''}`} />
                          <label htmlFor="password" className="block mb-2 mt-4">Password:</label>
                          <input value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" className={`w-full px-3 py-2 border rounded-md ${passwordError ? 'border-red-500' : ''}`} />
                          <div className="flex justify-center mt-4">
                              <button onClick={login} className="px-4 py-2 text-white bg-blue-500 rounded-md">Login</button>
                          </div>
                          {error && (
                              <div className="bg-red-500 p-2 mt-2 text-white rounded-md">
                                  {error}
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </section>
      </>
  );
}
