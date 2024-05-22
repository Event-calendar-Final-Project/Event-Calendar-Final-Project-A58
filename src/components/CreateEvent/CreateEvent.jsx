import { useContext, useState } from "react";
import { addEvent } from "../../services/event.service";
import { AppContext } from "../../context/AppContext";
import { updateUserEvents } from "../../services/users.service";
//import FileUpload from './FileUpload';

export default function CreateEvent() {
    const [event, setEvent] = useState({
        name: '',
        description: '',
        date: '',
        location: '',
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

        const eventId = await addEvent(userData.handle, event.name, event.description, event.date, event.location, uploadedFileUrl);

        if (eventId) {
            setSuccessMessage('Event created successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }


        await updateUserEvents(userData.handle, eventId);
        setEvent({
            name: '',
            description: '',
            date: '',
            location: '',
        });
    };


    // const handleFileUpload = (dataUrl) => {
    //     setUploadedFileUrl(dataUrl);
    // };

    return (
        <div>
            <h1>Create Event</h1>
            <div>
                <label htmlFor="input-name">Event Name:</label>
                <input
                    type="text"
                    value={event.name}
                    onChange={(e) => updateEvent(e.target.value, 'name')}
                    name="input-name"
                    id="input-name"
                />
            </div>
            <div>
                <label htmlFor="input-description">Description:</label>
                <textarea
                    value={event.description}
                    onChange={(e) => updateEvent(e.target.value, 'description')}
                    name="input-description"
                    id="input-description"
                    cols="30"
                    rows="10"
                />
            </div>
            <div>
                <label htmlFor="input-date">Date:</label>
                <input
                    type="date"
                    value={event.date}
                    onChange={(e) => updateEvent(e.target.value, 'date')}
                    name="input-date"
                    id="input-date"
                />
            </div>
            <div>
                <label htmlFor="input-location">Location:</label>
                <input
                    type="text"
                    value={event.location}
                    onChange={(e) => updateEvent(e.target.value, 'location')}
                    name="input-location"
                    id="input-location"
                />
            </div>
            {/* <FileUpload onUpload={handleFileUpload} />*/}
            <button onClick={createEvent}>Create</button>
            {successMessage && <p>{successMessage}</p>}

        </div>
    );
}
