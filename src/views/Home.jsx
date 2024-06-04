import React from 'react';
import CalendarMonth from '../components/CalendarMonth/CalendarMonth';
import Weather from '../components/Weather/Weather';




  export default function Home() {
    return (
      <>
        <div className="hero min-h-screen" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1716538878686-38567b89b5a0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'}}>
          <div className="hero-overlay bg-opacity-60"><Weather /></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">Upcoming Events</h1>
              <p className="mb-5">....</p>
            </div>
          </div>
        </div>
      </>
    );
  }


