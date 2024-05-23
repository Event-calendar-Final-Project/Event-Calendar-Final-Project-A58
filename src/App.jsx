import { useEffect, useState } from 'react';
import './App.css';
import Home from './views/Home.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './views/Login.jsx';
import Authenticated from './hoc/Authenticated.jsx';
import { AppContext } from './context/AppContext.jsx';
import Register from './views/Register.jsx';
import { getUserData } from './services/users.service.js';
import {useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config.js';
import CreateEvent from './components/CreateEvent/CreateEvent.jsx';
import AllEvents from './views/AllEvents/AllEvents.jsx';
import SingleEvent from './views/SingleEvent/SingleEvent.jsx';

function App() {
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
        // console.log(snapshot.val()); // { pesho: {...} }
        const userData = Object.values(snapshot.val())[0];
        setAppState({...appState, userData});
      });
  }, [appState.user])

  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={{...appState, setAppState}}>
          <Header/>
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/register" element={<Register />}/>
              <Route path="/create-event" element={<CreateEvent />}/>
              <Route path="/events" element={<AllEvents />}/>
              <Route path="/events/:id" element={<SingleEvent/>}/>
            </Routes>
          <Footer/>
        </AppContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App
