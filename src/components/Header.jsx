import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../services/auth.service";
import Reminder from "./Reminder/Reminder";

export default function Header () {
    const { user, userData, setAppState } = useContext(AppContext);

    const logout = async() => {
        await logoutUser();
        setAppState({ user: null, userData: null})
    };
    return (
        <div>
            <header>
                <div className="navbar bg-base-100">
                    <div className="flex-1">
                        <NavLink to="/" className="btn btn-ghost text-xl">Home</NavLink>
                        <div className="join join-horizontal">
                        <input type="radio" name="theme-buttons" className="btn theme-controller join-item" aria-label="Dark mode" value="default"/>
  <input type="radio" name="theme-buttons" className="btn theme-controller join-item" aria-label="Light mode" value="light"/>
</div>
                    </div>
                    <div className="flex-none gap-2">
                        <Reminder />
                        <NavLink to="/events" className="btn btn-ghost text-xl">Events</NavLink>
                        {user && userData ? (
    <>  
        <NavLink to="/create-event" className="btn btn-ghost text-xl">Create Event</NavLink>
        <NavLink to="/contacts" className="btn btn-ghost text-xl">Contacts</NavLink>
        <NavLink to="/my-calendar" className="btn btn-ghost text-xl">My Calendar</NavLink>
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                    <img alt="Profile" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                {userData.role === "admin" && ( <li> <NavLink to="/admin" className="justify-between">Admin Dashboard</NavLink></li>)}
                <li>
                    <NavLink to="/my-profile" className="justify-between">
                        My profile
                    </NavLink>
                </li>
                <li onClick={logout}><a href="/">Logout</a></li>
            </ul>
        </div>
        <NavLink to="/my-profile" className="btn btn-ghost text-xl">Welcome ,{userData.handle}!</NavLink>
    </>
) : (
    <>
        <NavLink to="/login" className="btn btn-ghost text-xl">Login</NavLink>
        <NavLink to="/register" className="btn btn-ghost text-xl">Register</NavLink>
    </>
)}
                    </div>
                </div>
            </header>
        </div>
    );
}

/*     return (
        <header>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/create-event">Create Event</NavLink>
            <NavLink to="/contacts">Contacts</NavLink>
            <NavLink to="/my-profile">My Profile</NavLink>
            <NavLink to="/my-calendar">My Calendar</NavLink>
            { user && userData
            ? (
                <>
                    {`Welcome ${userData.handle}!`}
                    <Button onClick={logout}>LogOut</Button>
                </>
            )
            : <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
            </>}
        </header>
    )
}
 */