import React from 'react';
import CalendarMonth from '../components/CalendarMonth/CalendarMonth';
import Weather from '../components/Weather/Weather';
import Clock from '../components/Watch/Watch';
import Reminder from '../components/Reminder/Reminder';




export default function Home() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center text-white">
      <div className="video-docker absolute top-0 left-0 w-full h-full overflow-hidden">
        <video
          className="min-w-full min-h-full absolute object-cover"
          src="https://cdn.pixabay.com/video/2024/01/24/197973-906217208_large.mp4"
          type="video/mp4"
          autoPlay
          muted
          loop
        ></video>
      </div>
      <div className="video-content space-y-2 z-5 flex flex-col items-center w-full">
        <div className="absolute top-0 left-0 p-2 flex flex-col space-y-2">
          <Weather />
          <Clock />
          <Reminder />
        </div>
        <h1 className="font-light text-6xl"></h1>
        <h3 className="font-light text-3xl"></h3>
      </div>
    </section>
  );
}
  


