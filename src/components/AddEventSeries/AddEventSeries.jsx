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
            <h2 className="text-xl font-medium text-white">Add Event Series</h2>
            <input className="textarea textarea-accent" placeholder="Enter event name here..." value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="textarea textarea-info" placeholder="Enter description here..." value={description} onChange={(e) => setDescription(e.target.value)} />
            <br></br><button onClick={handleAddSeries} className="btn btn-outline btn-info">Add Series</button>

            <h2 className="text-xl font-medium text-white">Add Event to Series</h2>
            <input className="textarea textarea-accent" placeholder="Series Title" value={seriesTitle} onChange={(e) => setSeriesTitle(e.target.value)} />
            <input className="textarea textarea-info" placeholder="Event Title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
            <input className="textarea textarea-info" placeholder="Event description " value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
            <input type="date" className="textarea textarea-info" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" className="textarea textarea-info" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date (optional)" />
            <select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
                <option value="none">One-Time</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
            </select>
            <button onClick={handleAddEvent} className="btn btn-outline btn-info">Add Event</button>
        </div>
    );
}
