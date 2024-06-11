/* eslint-disable no-case-declarations */
import { useContext, useEffect, useState } from "react";
import Event from "../components/Event/Event";
import { useSearchParams } from "react-router-dom";
import { getAllEvents } from "../services/event.service";
import PaginationEvents from "../components/PaginationEvents/PaginationEvents";
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
                            (event.author === userData.handle || (event.invitedUsers && Object.keys(event.invitedUsers).includes(userData.handle)));
                    });
                } else if (filter === 'all') {
                    filteredEvents = allEvents.filter(event => {
                        return event.type === 'public' || 
                            (event.type === 'private' && 
                            (event.author === userData.handle || (event.invitedUsers && Object.keys(event.invitedUsers).includes(userData.handle))));
                    });
                } else {
                    filteredEvents = allEvents.filter(event => event.type === filter);
                }
            } else {
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
        <div className="p-4 flex flex-col items-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-center">All Events</h1>
            <div className="flex justify-between mb-4 w-full max-w-[48rem]">
                {userData && (
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="select select-bordered select-accent w-full max-w-xs mr-4"
                    >
                        <option value="all">All events</option>
                        <option value="public">Public events</option>
                        <option value="private">Private events</option>
                        <option value="draft">Drafts</option>
                    </select>
                )}
                <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setSearchParams({ search: e.target.value })}
                    className="w-64 px-4 py-2 border rounded-md"
                />
            </div>
    
            <div className="flex flex-col items-center space-y-4 w-full">
                {currentEvents.map((event) => (
                    <div key={event.id} className="w-full max-w-[48rem]">
                        <Event key={event.id} event={event} />
                    </div>
                ))}
            </div>
            <PaginationEvents itemsPerPage={itemsPerPage} totalItems={events.length} paginate={paginateEvents} currentPage={currentPageEvents} />
        </div>
    );
}