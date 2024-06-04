import React from 'react';
import CalendarMonth from '../components/CalendarMonth/CalendarMonth';
import Weather from '../components/Weather/Weather';




  export default function Home() {
    return (
      <section className="relative h-screen flex flex-col items-center justify-center text-center text-white">
        <div className="video-docker absolute top-0 left-0 w-full h-full overflow-hidden">
          <video
            className="min-w-full min-h-full absolute object-cover"
            src="https://cdn.pixabay.com/video/2024/03/04/202987-919379330_large.mp4"
            type="video/mp4"
            autoPlay
            muted
            loop
          ></video>
        </div>
        <div className="video-content space-y-2 z-10">
          <div className="absolute top-0 left-0">
            <Weather />
          </div>
          <h1 className="font-light text-6xl"></h1>
          <h3 className="font-light text-3xl"></h3>
        </div>
      </section>
    );
}
  


