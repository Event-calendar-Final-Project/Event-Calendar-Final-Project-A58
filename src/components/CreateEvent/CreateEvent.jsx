import { useContext, useState } from "react";
import { addEvent } from "../../services/event.service";
import { AppContext } from "../../context/AppContext";
import { updateUserEvents } from "../../services/users.service";
import AddEventSeries from "../AddEventSeries/AddEventSeries";

export default function CreateEvent() {
    const [event, setEvent] = useState({
        name: '',
        description: '',
        date: '',
        location: '',
        startHour: '',
        endHour: '',
    });
    const { userData } = useContext(AppContext);
    const [uploadedFileUrl, setUploadedFileUrl] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const updateEvent = (value, key) => {
        setEvent({
            ...event,
            [key]: value,
        });
    }

    const createEvent = async () => {
        // Validation code...
        if (event.name.length < 16 || event.name.length > 64) {
            return alert('Event name must be between 16 and 64 characters long');
        }
    
        if (event.description.length < 5) {
            return alert('Description must be at least 5 characters long');
        }
    
        if (!event.date) {
            return alert('Please select a date for the event');
        }
    
        if (!event.location) {
            return alert('Please provide a location for the event');
        }
        console.log(userData);

        const startDateTime = new Date(`${event.date}T${event.startHour}`);
        const endDateTime = new Date(`${event.date}T${event.endHour}`);

        const eventId = await addEvent(userData.handle, event.name, event.description, startDateTime, endDateTime, event.location, uploadedFileUrl);

        if (eventId) {
            setSuccessMessage('Event created successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }

        await updateUserEvents(userData.handle, eventId, startDateTime, endDateTime);

        setEvent({
            name: '',
            description: '',
            date: '',
            location: '',
            startHour: '',
            endHour: '',
        });
    };
        // Rest of the code...
    
        // const handleFileUpload = (dataUrl) => {
//     setUploadedFileUrl(dataUrl);
// };

    return (
        <div className="p-6 max-w-sm mx-auto rounded-xl shadow-md flex items-center space-x-4"  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
            <div className="text-center">
                <div className="text-xl font-medium text-black">Create Event</div>
                <div>
                    <label htmlFor="input-name" className="block text-sm font-medium text-gray-700">Event Name:</label>
                    <input
                        type="text"
                        value={event.name}
                        onChange={(e) => updateEvent(e.target.value, 'name')}
                        name="input-name"
                        id="input-name"
                        className="textarea textarea-accent" placeholder="Enter event name here..."
                    />
                </div>
                <div>
                    <label htmlFor="input-description" className="block text-sm font-medium text-gray-700">Description:</label>
                    <textarea 
                        value={event.description}
                        onChange={(e) => updateEvent(e.target.value, 'description')}
                        name="input-description"
                        id="input-description"
                        cols="30"
                        rows="10"
                        className="textarea textarea-info" placeholder="Enter description here..."
                    />
                </div>
                <div>
                    <label htmlFor="input-date" className="block text-sm font-medium text-gray-700">Date:</label>
                    <input
                        type="date"
                        value={event.date}
                        onChange={(e) => updateEvent(e.target.value, 'date')}
                        name="input-date"
                        id="input-date"
                        className="textarea textarea-info" placeholder="Enter date here..."
                    />
                </div>
                <div>
                    <label htmlFor="input-start-hour" className="block text-sm font-medium text-gray-700">Start Hour:</label>
                    <input
                        type="time"
                        value={event.startHour}
                        onChange={(e) => updateEvent(e.target.value, 'startHour')}
                        name="input-start-hour"
                        id="input-start-hour"
                        className="textarea textarea-info"
                    />
                </div>
                <div>
                    <label htmlFor="input-end-hour" className="block text-sm font-medium text-gray-700">End Hour:</label>
                    <input
                        type="time"
                        value={event.endHour}
                        onChange={(e) => updateEvent(e.target.value, 'endHour')}
                        name="input-end-hour"
                        id="input-end-hour"
                        className="textarea textarea-info"
                    />
                </div>
                <div>
                    <label htmlFor="input-location" className="block text-sm font-medium text-gray-700">Location:</label>
                    <input
                        type="text"
                        value={event.location}
                        onChange={(e) => updateEvent(e.target.value, 'location')}
                        name="input-location"
                        id="input-location"
                        className="textarea textarea-info" placeholder="Enter location here..."
                    />
                </div>
                {/* <FileUpload onUpload={handleFileUpload} />*/}
                <div className="text-center">
                    <button onClick={createEvent} className="btn btn-outline btn-info">
                        Create
                    </button>
                    {successMessage && <p>{successMessage}</p>}
                </div>
                <AddEventSeries />
            </div>
        </div>
    );
}