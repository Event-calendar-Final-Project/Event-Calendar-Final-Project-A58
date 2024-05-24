import { useState } from "react";
import { addEventSeries, addEventToSeries } from "../../services/eventSeries.service";

export default function AddEventSeries() {
    const [seriesId, setSeriesId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventId, setEventId] = useState('');

    const handleAddSeries = async () => {
        await addEventSeries(seriesId, title, description);
        alert("Event series added!");
    };

    const handleAddEvent = async () => {
        await addEventToSeries(seriesId, eventId);
        alert("Event added to series!");
    };

    return (
        <div>
            <h2>Add Event Series</h2>
            <input type="text" placeholder="Series ID" value={seriesId} onChange={(e) => setSeriesId(e.target.value)} />
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button onClick={handleAddSeries}>Add Series</button>

            <h2>Add Event to Series</h2>
            <input type="text" placeholder="Event ID" value={eventId} onChange={(e) => setEventId(e.target.value)} />
            <button onClick={handleAddEvent}>Add Event</button>
        </div>
    );
}
