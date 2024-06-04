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
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>All Events</h1>
            <input
                type="text"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
                {events.map((event) => (
                    <div className="event-card shadow-xl transform transition-transform hover:scale-105 mt-4 flex flex-row items-center p-4 space-x-4 rounded-lg">
                                               <div className="card-body">
                            <Event className="card-title"  key={event.id} event={event} />
                            <div className="card-actions justify-end">
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
