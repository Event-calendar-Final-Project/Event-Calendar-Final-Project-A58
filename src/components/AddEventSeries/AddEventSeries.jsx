import { useContext, useState } from "react";
import { addEventSeries, addEventToSeriesById } from "../../services/eventSeries.service";
import { AppContext } from "../../context/AppContext";
import { addEventPhoto } from "../../services/upload.service";
import PhotoPreview from "../PhotoPreview/PhotoPreview";


export default function AddEventSeries() {
    const [series, setSeries] = useState({
        seriesName: '',
        seriesDescription: '',
        seriesEndDate: '',
        repeat: 'daily',
    });
    const [events, setEvent] = useState({
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
            ...events,
            [key]: value,
        });
    };    

    const createEventSeries = async () => {
        if (series.seriesName.length < 5 || series.seriesName.length > 64) {
            return alert('Series name must be between 5 and 64 characters long');
        }
    
        if (events.name.length < 16 || events.name.length > 64) {
            return alert('Event name must be between 16 and 64 characters long');
        }
    
        if (events.description.length < 5) {
            return alert('Event description must be at least 5 characters long');
        }
    
        if (!events.location) {
            return alert('Please provide a location for the events');
        }
    
        let photoURL = '';
        if (selectedFile) {
            photoURL = await addEventPhoto(selectedFile, events.name);
        }

const startDateTime = new Date(`${events.startDate}T${events.startHour}`);
const endDateTime = new Date(`${events.endDate}T${events.endHour}`);
const startDateTimeLocal = new Date(startDateTime.toLocaleString());
const endDateTimeLocal = new Date(endDateTime.toLocaleString());
const seriesEndDate = new Date(series.seriesEndDate);

const seriesId = await addEventSeries(userData.handle, series.seriesName, series.seriesDescription, series.seriesEndDate, series.repeat);

const timeDiff = seriesEndDate.getTime() - startDateTimeLocal.getTime();

const timeFormat = series.repeat;

let timeDiffAdjusted;
switch (timeFormat) {
    case 'daily':
        timeDiffAdjusted = timeDiff / (1000 * 3600 * 24);
        break;
    case 'weekly':
        timeDiffAdjusted = timeDiff / (1000 * 3600 * 24 * 7);
        break;
    case 'monthly':
        
        timeDiffAdjusted = timeDiff / (1000 * 3600 * 24 * 30.44);
        break;
    case 'yearly':
        
        timeDiffAdjusted = timeDiff / (1000 * 3600 * 24 * 365.25);
        break;
    default:
        throw new Error('Invalid time format');
}

const eventsArr = Array.from({ length: Math.floor(timeDiffAdjusted) + 1 }).map((_, i) => {
    const eventStartDateLocal = new Date(startDateTimeLocal);
    const eventEndDateLocal = new Date(endDateTimeLocal);

    switch (timeFormat) {
        case 'daily':
            eventStartDateLocal.setDate(startDateTimeLocal.getDate() + i);
            eventEndDateLocal.setDate(endDateTimeLocal.getDate() + i);
            break;
        case 'weekly':
            eventStartDateLocal.setDate(startDateTimeLocal.getDate() + i * 7);
            eventEndDateLocal.setDate(endDateTimeLocal.getDate() + i * 7);
            break;
        case 'monthly':
            eventStartDateLocal.setMonth(startDateTimeLocal.getMonth() + i);
            eventEndDateLocal.setMonth(endDateTimeLocal.getMonth() + i);
            break;
        case 'yearly':
            eventStartDateLocal.setFullYear(startDateTimeLocal.getFullYear() + i);
            eventEndDateLocal.setFullYear(endDateTimeLocal.getFullYear() + i);
            break;
    }

    return {
        ...events,
        startDateTimeLocal: eventStartDateLocal,
        endDateTimeLocal: eventEndDateLocal,
        date: eventStartDateLocal.toISOString().split('T')[0],
    };
});




eventsArr.map(async (events) => {
    console.log(series.repeat);
     await addEventToSeriesById(
        seriesId,
        userData.handle,
        events.name,
        events.description,
        events.startDateTimeLocal,
        events.endDateTimeLocal,
        events.location,
        photoURL,
        events.type
    );
});


        setSeries({
            seriesName: '',
            seriesDescription: '',
            seriesEndDate: '',
            repeat: '',
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

        if (seriesId) {
            setSuccessMessage('Event series created successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }

    };

    return (
        <div className="max-w-3xl mx-auto p-1 mt-1">
            <h1 className="text-2xl font-bold mb-4 text-center">Create Event Series</h1>
            <div className="bg-gray-100 shadow-lg rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-series-name" className="block text-sm font-medium text-gray-700 w-1/6">Series Name:</label>
                    <input
                        type="text"
                        value={series.seriesName}
                        onChange={(e) => updateSeries(e.target.value, 'seriesName')}
                        name="input-series-name"
                        id="input-series-name"
                        className="input input-bordered w-3/5"
                        placeholder="Enter series name here..."
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-series-description" className="block text-sm font-medium text-gray-700 w-1/6">Series Description:</label>
                    <textarea
                        value={series.seriesDescription}
                        onChange={(e) => updateSeries(e.target.value, 'seriesDescription')}
                        name="input-series-description"
                        id="input-series-description"
                        cols="30"
                        rows="2"
                        className="textarea textarea-bordered w-3/5"
                        placeholder="Enter series description here..."
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-series-end-date" className="block text-sm font-medium text-gray-700 w-1/6">End Date:</label>
                    <input
                        type="date"
                        value={series.seriesEndDate}
                        onChange={(e) => updateSeries(e.target.value, 'seriesEndDate')}
                        name="input-series-end-date"
                        id="input-series-end-date"
                        className="input input-bordered w-3/5"
                        placeholder="Enter series end date (optional)..."
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-repeat" className="block text-sm font-medium text-gray-700 w-1/6">Repeat:</label>
                    <select
                        value={series.repeat}
                        onChange={(e) => updateSeries(e.target.value, 'repeat')}
                        name="input-repeat"
                        id="input-repeat"
                        className="select select-bordered w-3/5"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <hr />
                <h2 className="text-xl text-center font-medium text-gray-700 mb-2">Starting Event</h2>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-events-name" className="block text-sm font-medium text-gray-700 w-1/6">Event Name:</label>
                    <input
                        type="text"
                        value={events.name}
                        onChange={(e) => updateEvent(e.target.value, 'name')}
                        name="input-events-name"
                        id="input-events-name"
                        className="input input-bordered w-3/5"
                        placeholder="Enter events name here..."
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-events-description" className="block text-sm font-medium text-gray-700 w-1/6">Event Description:</label>
                    <textarea
                        value={events.description}
                        onChange={(e) => updateEvent(e.target.value, 'description')}
                        name="input-events-description"
                        id="input-events-description"
                        cols="30"
                        rows="2"
                        className="textarea textarea-bordered w-3/5"
                        placeholder="Enter events description here..."
                    />
                </div>
                <div className="flex items-center space-x-8">
    <div className="ml-32 flex w-1/4">
        <label htmlFor="input-start-date" className="block text-sm font-medium text-gray-700 w-1/4">Start Date:</label>
        <input
            type="date"
            value={events.startDate}
            onChange={(e) => updateEvent(e.target.value, 'startDate')}
            name="input-start-date"
            id="input-start-date"
            className="input input-bordered w-3/4"
        />
    </div>
    <div className="flex w-1/4">
        <label htmlFor="input-end-date" className="block text-sm font-medium text-gray-700 w-1/4">End Date:</label>
        <input
            type="date"
            value={events.endDate}
            onChange={(e) => updateEvent(e.target.value, 'endDate')}
            name="input-end-date"
            id="input-end-date"
            className="input input-bordered w-3/4"
        />
    </div>
</div>
                <div className="flex items-center space-x-8">
                        <div className="ml-32 flex w-1/4">
                            <label htmlFor="input-start-hour" className="block text-sm font-medium text-gray-700 w-1/4">Start Hour:</label>
                            <input
                                type="time"
                                value={events.startHour}
                                onChange={(e) => updateEvent(e.target.value, 'startHour')}
                                name="input-start-hour"
                                id="input-start-hour"
                                className="input input-bordered w-3/5"
                            />
                        </div>
                        <div className="flex w-1/4">
                            <label htmlFor="input-end-hour" className="block text-sm font-medium text-gray-700 w-1/4">End Hour:</label>
                            <input
                                type="time"
                                value={events.endHour}
                                onChange={(e) => updateEvent(e.target.value, 'endHour')}
                                name="input-end-hour"
                                id="input-end-hour"
                                className="input input-bordered w-3/5"
                            />
                        </div>
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-type" className="block text-sm font-medium text-gray-700 w-1/6">Event Type:</label>
                    <select
                        value={events.type}
                        onChange={(e) => updateEvent(e.target.value, 'type')}
                        name="input-type"
                        id="input-type"
                        className="select select-bordered w-3/5"
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-location" className="block text-sm font-medium text-gray-700 w-1/6">Location:</label>
                    <input
                        type="text"
                        value={events.location}
                        onChange={(e) => updateEvent(e.target.value, 'location')}
                        name="input-location"
                        id="input-location"
                        className="input input-bordered w-3/5"
                        placeholder="Enter location here..."
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <label htmlFor="input-file" className="block text-sm font-medium text-gray-700 w-1/6">Event Photo:</label>
                    <input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        name="input-file"
                        id="input-file"
                        className="input input-bordered w-3/5"
                    />
                </div>
                <PhotoPreview photo={selectedFile} />
                <div className="flex justify-center">
                    <button onClick={createEventSeries} className="btn btn-outline btn-info w-1/4">
                        Create Series
                    </button>
                </div>
                {successMessage && <p className="text-center text-green-500 mt-2">{successMessage}</p>}
            </div>
        </div>
    );
}
