import { useContext, useState } from "react";
import { addEvent } from "../../services/event.service";
import { AppContext } from "../../context/AppContext";
import { updateUserEvents } from "../../services/users.service";
import AddEventSeries from "../AddEventSeries/AddEventSeries";
import { addEventPhoto } from "../../services/upload.service";
import PhotoPreview from "../PhotoPreview/PhotoPreview";

export default function CreateEvent() {
    const [event, setEvent] = useState({
        name: '',
        description: '',
        startDate: '', 
        endDate: '', 
        location: '',
        startHour: '',
        endHour: '',
        type: 'public',
        
    });
    const { userData } = useContext(AppContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isCreatingEventSeries, setIsCreatingEventSeries] = useState(false);

    const updateEvent = (value, key) => {
        if (key === 'type') {
            value = value === 'public' ? 'public' : (value === 'private' ? 'private' : 'draft');
        }
        setEvent({
            ...event,
            [key]: value,
        });
    }

    const createEvent = async () => {

        if (event.name.length < 16 || event.name.length > 64) {
            return alert('Event name must be between 16 and 64 characters long');
        }
    
        if (event.description.length < 5) {
            return alert('Description must be at least 5 characters long');
        }
    
        if (!event.startDate || !event.endDate) {
            return alert('Please select a date for the event');
        }
    
        if (!event.location) {
            return alert('Please provide a location for the event');
        }
        console.log(userData);

        let photoURL = '';
        if (selectedFile) {
            photoURL = await addEventPhoto(selectedFile, event.name);
        }

        const startDateTime = new Date(`${event.startDate}T${event.startHour}`);
        const endDateTime = new Date(`${event.endDate}T${event.endHour}`);
        const startDateTimeLocal = new Date(startDateTime.toLocaleString());
        const endDateTimeLocal = new Date(endDateTime.toLocaleString());

        const eventId = await addEvent(userData.handle, event.name, event.description, startDateTimeLocal, endDateTimeLocal, event.location, photoURL, event.type);

        if (eventId) {
            setSuccessMessage('Event created successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }

        await updateUserEvents(userData.handle, eventId, startDateTime, endDateTime, event.type);

        setEvent({
            name: '',
            description: '',
            startDate: '', 
            endDate: '', 
            location: '',
            startHour: '',
            endHour: '',
        });
    };
    const toggleEventSeries = () => {
        setIsCreatingEventSeries(!isCreatingEventSeries);
    };

    return (
        <div className="max-w-3xl mx-auto p-4 mt-6">
            
            <div className="flex justify-center mb-2">
                <button onClick={toggleEventSeries} className={`btn ${isCreatingEventSeries ? 'btn-outline' : 'btn-info'} mr-2`}>Create Single Event</button>
                <button onClick={toggleEventSeries} className={`btn ${isCreatingEventSeries ? 'btn-info' : 'btn-outline'} ml-2`}>Create Event Series</button>
            </div>
            { !isCreatingEventSeries &&
            <>
                <h1 className="text-2xl font-bold mb-2 text-center">Create Event</h1>
                <div className="bg-gray-100 shadow-lg rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-4">
                        <label htmlFor="input-name" className="block text-sm font-medium text-gray-700 w-1/6">Event Name:</label>
                        <input
                            type="text"
                            value={event.name}
                            onChange={(e) => updateEvent(e.target.value, 'name')}
                            name="input-name"
                            id="input-name"
                            className="input input-bordered w-3/5"
                            placeholder="Enter event name here..."
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="input-description" className="block text-sm font-medium text-gray-700 w-1/6">Description:</label>
                        <textarea
                            value={event.description}
                            onChange={(e) => updateEvent(e.target.value, 'description')}
                            name="input-description"
                            id="input-description"
                            cols="30"
                            rows="2"
                            className="textarea textarea-bordered w-3/5 h-96"
                            placeholder="Enter description here..."
                        />
                    </div>
                    <div className="flex items-center space-x-8">
    <div className="ml-32 flex w-1/4">
        <label htmlFor="input-start-date" className="block text-sm font-medium text-gray-700 w-1/4">Start Date:</label>
        <input
            type="date"
            value={event.startDate}
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
            value={event.endDate}
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
                        <label htmlFor="input-type" className="block text-sm font-medium text-gray-700 w-1/6">Event Type:</label>
                        <select
                            value={event.type}
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
                            value={event.location}
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
                        <button onClick={createEvent} className="btn btn-outline btn-info w-1/4">
                            Create
                        </button>
                    </div>
                    {successMessage && <p className="text-center text-green-500 mt-2">{successMessage}</p>}
                
                    
                </div>
            </>}
            {isCreatingEventSeries && <AddEventSeries />}
        </div>
    );
}