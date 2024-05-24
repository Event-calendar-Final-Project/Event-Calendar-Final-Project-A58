import { NavLink } from "react-router-dom";
import Button from "./Button";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../services/auth.service";

export default function Header () {
    const { user, userData, setAppState } = useContext(AppContext);

    const logout = async() => {
        await logoutUser();
        setAppState({ user: null, userData: null})
    };

    return (
        <header>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/create-event">Create Event</NavLink>
            <NavLink to="/contacts">Contacts</NavLink>
            <NavLink to={userData.handle}>My Profile</NavLink>
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
