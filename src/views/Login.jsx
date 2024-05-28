import { useContext, useEffect, useState } from "react"
import Button from "../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { loginUser } from "../services/auth.service";

export default function Login() {
    const { user, setAppState } = useContext(AppContext);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            navigate(location.state?.from.pathname || '/');
        }
    }, [user]);

    const login = async() => {
        const { user } = await loginUser(form.email, form.password);
        setAppState({ user, userData: null });
        navigate(location.state?.from.pathname || '/');
    };

    const updateForm = prop => e => {
        setForm({
          ...form,
          [prop]: e.target.value,
        });
      };

      return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-12 rounded-md shadow-md" style={{ width: '400px' }}>
                <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
                <label htmlFor="email" className="block mb-2">Email:</label>
                <input value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" className="w-full px-3 py-2 border rounded-md" />
                <label htmlFor="password" className="block mb-2">Password:</label>
                <input value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" className="w-full px-3 py-2 border rounded-md" /> <br /> <br /><br />
                <div className="flex justify-center"><button onClick={login} className="px-4 py-2 text-white bg-blue-500 rounded-md">Login</button></div>
            </div>
        </div>
    );
        }
