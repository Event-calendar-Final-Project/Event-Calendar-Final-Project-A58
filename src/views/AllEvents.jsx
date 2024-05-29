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
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">All Events</h1>
            <input
                type="text"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md mb-4"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {events.map((event) => (
                    <Event key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}
