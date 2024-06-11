import { useContext, useState } from "react";
import { addEventSeries, addEventToSeriesByTitle } from "../../services/eventSeries.service";
import { AppContext } from "../../context/AppContext";
import { updateUserEvents } from "../../services/users.service";
import { addEventPhoto } from "../../services/upload.service";
import PhotoPreview from "../PhotoPreview/PhotoPreview";

export default function AddEventSeries() {
    const [series, setSeries] = useState({
        seriesName: '',
        seriesDescription: '',
        seriesEndDate: '',
        repeat: 'none',
    });
    const [event, setEvent] = useState({
        name: '',
        description: '',
        date: '',
        location: '',
        startHour: '',
        endHour: '',
        type: 'public',
    });
    const { userData } = useContext(AppContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const updateSeries = (value, key) => {
        setSeries({
            ...series,
            [key]: value,
        });
    };

    const updateEvent = (value, key) => {
        setEvent({
            ...event,
            [key]: value,
        });
    };

    const createEventSeries = async () => {
        if (series.seriesName.length < 5 || series.seriesName.length > 64) {
            return alert('Series name must be between 5 and 64 characters long');
        }
    
        if (event.name.length < 16 || event.name.length > 64) {
            return alert('Event name must be between 16 and 64 characters long');
        }
    
        if (event.description.length < 5) {
            return alert('Event description must be at least 5 characters long');
        }
    
        if (!event.date) {
            return alert('Please select a date for the starting event');
        }
    
        if (!event.location) {
            return alert('Please provide a location for the event');
        }
    
        let photoURL = '';
        if (selectedFile) {
            photoURL = await addEventPhoto(selectedFile, event.name);
        }

        const startDateTime = new Date(`${event.date}T${event.startHour}`);
        const endDateTime = new Date(`${event.date}T${event.endHour}`);
        const startDateTimeLocal = new Date(startDateTime.toLocaleString());
        const endDateTimeLocal = new Date(endDateTime.toLocaleString());

        const seriesId = await addEventSeries(userData.handle, series.seriesName, series.seriesDescription, series.seriesEndDate, series.repeat);
        const eventId = await addEventToSeriesByTitle(seriesId, userData.handle, event.name, event.description, startDateTimeLocal, endDateTimeLocal, event.location, photoURL, event.type);

        if (seriesId && eventId) {
            setSuccessMessage('Event series created successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }

        await updateUserEvents(userData.handle, eventId, startDateTime, endDateTime, event.type);

        setSeries({
            seriesName: '',
            seriesDescription: '',
            seriesEndDate: '',
            repeat: 'none',
        });

        setEvent({
            name: '',
            description: '',
            date: '',
            location: '',
            startHour: '',
            endHour: '',
            type: 'public',
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 mt-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Create Event Series</h1>
            <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-series-name" className="block text-sm font-medium text-gray-700 w-1/4">Series Name:</label>
                    <input
                        type="text"
                        value={series.seriesName}
                        onChange={(e) => updateSeries(e.target.value, 'seriesName')}
                        name="input-series-name"
                        id="input-series-name"
                        className="input input-bordered w-3/4"
                        placeholder="Enter series name here..."
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-series-description" className="block text-sm font-medium text-gray-700 w-1/4">Series Description:</label>
                    <textarea
                        value={series.seriesDescription}
                        onChange={(e) => updateSeries(e.target.value, 'seriesDescription')}
                        name="input-series-description"
                        id="input-series-description"
                        cols="30"
                        rows="2"
                        className="textarea textarea-bordered w-3/4"
                        placeholder="Enter series description here..."
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-series-end-date" className="block text-sm font-medium text-gray-700 w-1/4">End Date:</label>
                    <input
                        type="date"
                        value={series.seriesEndDate}
                        onChange={(e) => updateSeries(e.target.value, 'seriesEndDate')}
                        name="input-series-end-date"
                        id="input-series-end-date"
                        className="input input-bordered w-3/4"
                        placeholder="Enter series end date (optional)..."
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-repeat" className="block text-sm font-medium text-gray-700 w-1/4">Repeat:</label>
                    <select
                        value={series.repeat}
                        onChange={(e) => updateSeries(e.target.value, 'repeat')}
                        name="input-repeat"
                        id="input-repeat"
                        className="select select-bordered w-3/4"
                    >
                        <option value="none">One-Time</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <hr />
                <h2 className="text-xl font-medium text-gray-700 mb-2">Starting Event</h2>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-event-name" className="block text-sm font-medium text-gray-700 w-1/4">Event Name:</label>
                    <input
                        type="text"
                        value={event.name}
                        onChange={(e) => updateEvent(e.target.value, 'name')}
                        name="input-event-name"
                        id="input-event-name"
                        className="input input-bordered w-3/4"
                        placeholder="Enter event name here..."
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-event-description" className="block text-sm font-medium text-gray-700 w-1/4">Event Description:</label>
                    <textarea
                        value={event.description}
                        onChange={(e) => updateEvent(e.target.value, 'description')}
                        name="input-event-description"
                        id="input-event-description"
                        cols="30"
                        rows="2"
                        className="textarea textarea-bordered w-3/4"
                        placeholder="Enter event description here..."
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-date" className="block text-sm font-medium text-gray-700 w-1/4">Date:</label>
                    <input
                        type="date"
                        value={event.date}
                        onChange={(e) => updateEvent(e.target.value, 'date')}
                        name="input-date"
                        id="input-date"
                        className="input input-bordered w-3/4"
                    />
                </div>
                <div className="flex items-center space-x-8">
                        <div className="ml-48 flex w-1/4">
                            <label htmlFor="input-start-hour" className="block text-sm font-medium text-gray-700 w-1/4">Start Hour:</label>
                            <input
                                type="time"
                                value={event.startHour}
                                onChange={(e) => updateEvent(e.target.value, 'startHour')}
                                name="input-start-hour"
                                id="input-start-hour"
                                className="input input-bordered w-3/4"
                            />
                        </div>
                        <div className="flex w-1/4">
                            <label htmlFor="input-end-hour" className="block text-sm font-medium text-gray-700 w-1/4">End Hour:</label>
                            <input
                                type="time"
                                value={event.endHour}
                                onChange={(e) => updateEvent(e.target.value, 'endHour')}
                                name="input-end-hour"
                                id="input-end-hour"
                                className="input input-bordered w-3/4"
                            />
                        </div>
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-type" className="block text-sm font-medium text-gray-700 w-1/4">Event Type:</label>
                    <select
                        value={event.type}
                        onChange={(e) => updateEvent(e.target.value, 'type')}
                        name="input-type"
                        id="input-type"
                        className="select select-bordered w-3/4"
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-location" className="block text-sm font-medium text-gray-700 w-1/4">Location:</label>
                    <input
                        type="text"
                        value={event.location}
                        onChange={(e) => updateEvent(e.target.value, 'location')}
                        name="input-location"
                        id="input-location"
                        className="input input-bordered w-3/4"
                        placeholder="Enter location here..."
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-file" className="block text-sm font-medium text-gray-700 w-1/4">Event Photo:</label>
                    <input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        name="input-file"
                        id="input-file"
                        className="input input-bordered w-3/4"
                    />
                </div>
                <PhotoPreview photo={selectedFile} />
                <div className="flex justify-center">
                    <button onClick={createEventSeries} className="btn btn-outline btn-info w-full">
                        Create Series
                    </button>
                </div>
                {successMessage && <p className="text-center text-green-500 mt-2">{successMessage}</p>}
            </div>
        </div>
    );
}
