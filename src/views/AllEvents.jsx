/* eslint-disable no-case-declarations */
import { useEffect, useState } from "react";
import Event from "../components/Event/Event";
import { useSearchParams } from "react-router-dom";
import { getAllEvents } from "../services/event.service"; // Import the getAllEvents function
import Pagination from "../components/Pagination/Pagination";

export default function AllEvents() {
    const [events, setEvents] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') || '';
    const [currentPageEvents, setCurrentPageEvents] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        getAllEvents(search).then(setEvents);
    }, [search]);

    const setSearch = (value) => {
        setSearchParams({ search: value });
    };

    const paginateEvents = (pageNumber) => setCurrentPageEvents(pageNumber);
    const indexOfLastEvent = currentPageEvents * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>All Events</h1>
            <input
                type="text"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
                {currentEvents.map((event) => (
                    <div key={event.id} className="event-card shadow-xl transform transition-transform hover:scale-105 mt-4 flex flex-row items-center p-4 space-x-4 rounded-lg">
                                               <div className="card-body">
                            <Event className="card-title"  key={event.id} event={event} />
                            <div className="card-actions justify-end">
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination itemsPerPage={itemsPerPage} totalItems={events.length} paginate={paginateEvents} currentPage={currentPageEvents} />
        </div>
    );
}
