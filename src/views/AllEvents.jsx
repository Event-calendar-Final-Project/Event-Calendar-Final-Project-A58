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
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">All Events</h1>
            <div className="flex justify-between mb-4">
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

            <div className="grid grid-cols-2 gap-4">
                {currentEvents.map((event) => (
                    <div key={event.id} className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-300">
                        <Event key={event.id} event={event} />
                    </div>
                ))}
            </div>
            <Pagination itemsPerPage={itemsPerPage} totalItems={events.length} paginate={paginateEvents} currentPage={currentPageEvents} />
        </div>
    );
}