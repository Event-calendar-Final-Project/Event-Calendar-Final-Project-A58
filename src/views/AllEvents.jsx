/* eslint-disable no-case-declarations */
import { useEffect, useState } from "react";
import Event from "../components/Event/Event";
import { useSearchParams } from "react-router-dom";
import { getAllEvents } from "../services/event.service"; // Import the getAllEvents function

export default function AllEvents() {
    const [events, setEvents] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') || '';

    useEffect(() => {
        getAllEvents(search).then(setEvents);
    }, [search]);

    const setSearch = (value) => {
        setSearchParams({ search: value });
    };

    return (
<<<<<<< HEAD
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>All Events</h1>
=======
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">All Events</h1>
>>>>>>> 8190cd78a0929dd846983097d3fb5a0e6a3831f3
            <input
                type="text"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md mb-4"
            />
<<<<<<< HEAD
            <div className="grid grid-cols-4 gap-4">
                {events.map((event) => (
                    <div className="card w-96 bg-base-100 shadow-xl image-full">
                        <figure><img src="https://images.unsplash.com/photo-1716835457716-0e879b88c774?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="car!" style={{ width: '60%', height: '100%' }}/></figure>
                        <div className="card-body">
                            <Event className="card-title"  key={event.id} event={event} />
                            <div className="card-actions justify-end">
                            </div>
                        </div>
                    </div>
=======
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {events.map((event) => (
                    <Event key={event.id} event={event} />
>>>>>>> 8190cd78a0929dd846983097d3fb5a0e6a3831f3
                ))}
            </div>
        </div>
    );
}
