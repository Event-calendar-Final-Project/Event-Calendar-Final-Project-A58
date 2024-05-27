import { useState } from "react";
import { addEventSeries, addEventToSeriesByTitle } from "../../services/eventSeries.service";

export default function AddEventSeries() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [seriesTitle, setSeriesTitle] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [repeat, setRepeat] = useState('none');

    const handleAddSeries = async () => {
        const generatedSeriesId = await addEventSeries(title, description);
        setSeriesTitle(title);  // Save the series title
        alert("Event series added with title: " + title);
    };

    const handleAddEvent = async () => {
        if (!seriesTitle) {
            return alert("Please enter a valid Series Title");
        }
        await addEventToSeriesByTitle(seriesTitle, eventTitle, eventDescription, startDate, endDate, repeat);
        alert("Event added to series!");
    };

    return (
        <div>
            <h2>Add Event Series</h2>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button onClick={handleAddSeries}>Add Series</button>

            <h2>Add Event to Series</h2>
            <input type="text" placeholder="Series Title" value={seriesTitle} onChange={(e) => setSeriesTitle(e.target.value)} />
            <input type="text" placeholder="Event Title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
            <input type="text" placeholder="Event Description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date (optional)" />
            <select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
                <option value="none">One-Time</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
            </select>
            <button onClick={handleAddEvent}>Add Event</button>
        </div>
    );
}
