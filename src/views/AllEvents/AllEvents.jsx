/* eslint-disable no-case-declarations */
import { useEffect, useState } from "react";
import Event from "../../components/Event/Event";
import { useSearchParams } from "react-router-dom";
import { getAllEvents } from "../../services/event.service"; // Import the getAllEvents function


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
            <h1>All Events</h1>
            <input
                type="text"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
            />
            {events.map((event) => (
                <Event key={event.id} event={event} />
            ))}
        </div>
    );
}
