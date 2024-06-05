import { useContext, useEffect, useState } from 'react';
import './App.css';
import Home from './views/Home.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './views/Login.jsx';
import { AppContext } from './context/AppContext.jsx';
import Register from './views/Register.jsx';
import { logoutUser } from './services/auth.service.js';
import { getUserData } from './services/users.service.js';
import {useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config.js';
import CreateEvent from './components/CreateEvent/CreateEvent.jsx';
import AllEvents from './views/AllEvents.jsx';
import SingleEvent from './views/SingleEvent.jsx';
import ContactsList from './views/ContactsList.jsx';
import UserData from './views/UserData.jsx';
import AdminDashboard from './components/Admin/AdminDashboard.jsx';
import MyCalendar from './views/MyCalendar.jsx';


export default function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);

  if (appState.user !== user) {
    setAppState({ ...appState, user });
  }

  useEffect(() => {
    if (!appState.user) return;

 

    getUserData(appState.user.uid)
      .then(snapshot => {
         console.log(snapshot.val());
        const userData = Object.values(snapshot.val())[0];
        setAppState({...appState, userData});
        if (userData &&  userData.isBlocked){
          logoutUser();
          alert("You are in the list of blocked users and cannot login!");
        }
      });
         
  }, [appState.user])
  console.log(appState.userData);

  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={{...appState, setAppState}}>
          <Header/>
            <Routes>
            <Route path="/admin" element={appState.userData && appState.userData.role === "admin" ? <AdminDashboard /> : <Home />} />

              <Route path="/" element={<Home />}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/register" element={<Register />}/>
              <Route path="/create-event" element={<CreateEvent />}/>
              <Route path="/contacts" element={<ContactsList />}/>
              <Route path="/events" element={<AllEvents />}/>
              <Route path="/events/:id" element={<SingleEvent/>}/>
              <Route path="/my-profile" element={<UserData user={appState.userData}/>}/>
              <Route path="/:handle" element={<UserData />}/>
              <Route path="my-calendar" element={<MyCalendar />}/>
            </Routes>
        </AppContext.Provider>
      </BrowserRouter>
    </>
  )
}


