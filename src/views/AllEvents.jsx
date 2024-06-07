/* eslint-disable no-case-declarations */
import { useContext, useEffect, useState } from "react";
import Event from "../components/Event/Event";
import { useSearchParams } from "react-router-dom";
import { getAllEvents } from "../services/event.service";
import Pagination from "../components/Pagination/Pagination";
import { AppContext } from "../context/AppContext";

export default function AllEvents() {
    const [events, setEvents] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') || '';
    const [currentPageEvents, setCurrentPageEvents] = useState(1);
    const itemsPerPage = 4;
    const { userData } = useContext(AppContext);
    const [filter, setFilter] = useState('all');
    
    useEffect(() => {
        getAllEvents(search).then((allEvents) => {
            let filteredEvents = allEvents;
            if (userData) {
                if (filter === 'private') {
                    filteredEvents = allEvents.filter(event => {
                        return event.type === 'private' && 
                            (event.author === userData.handle || Object.keys(event.invitedUsers).includes(userData.handle));
                    });
                } else if (filter === 'all') {
                    filteredEvents = allEvents.filter(event => {
                        return event.type === 'public' || 
                            (event.type === 'private' && 
                            (event.author === userData.handle || Object.keys(event.invitedUsers).includes(userData.handle)));
                    });
                } else {
                    filteredEvents = allEvents.filter(event => event.type === filter);
                }
            } else {
                // If not logged in, only show public events
                filteredEvents = allEvents.filter(event => event.type === 'public');
            }
            setEvents(filteredEvents);
        });
    }, [search, userData, filter]);

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
                onChange={(e) => setSearchParams({ search: e.target.value })}
            />
            {userData ? (
                <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="select select-bordered select-accent w-full max-w-xs mb-4"
    style={{
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        color: '#374151',
        fontSize: '1rem',
        cursor: 'pointer'
    }}
>
    <option value="all">All events</option>
    <option value="public">Public events</option>
    <option value="private">Private events</option>
    <option value="draft">Drafts</option>
</select>
            ) : null}
           
            <div className="grid grid-cols-2 gap-2">
            
                {currentEvents.map((event) => (
                    <div key={event.id} className="event-card bg-white shadow-lg transform transition-transform hover:scale-105 mt-4 flex flex-row items-center p-4 space-x-4 rounded-lg ">
                        <div className="card-body">
                       
                            <Event className="card-title" key={event.id} event={event} />
                            <div className="card-actions justify-end">
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        <br />
            <Pagination itemsPerPage={itemsPerPage} totalItems={events.length} paginate={paginateEvents} currentPage={currentPageEvents} />
        </div>
    );
}