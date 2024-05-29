import { useContext, useState } from "react";
import { addEvent } from "../../services/event.service";
import { AppContext } from "../../context/AppContext";
import { updateUserEvents } from "../../services/users.service";
import AddEventSeries from "../AddEventSeries/AddEventSeries";
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
        
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4"  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1716835457716-0e879b88c774?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
{/*             <div className="flex-shrink-0">
                <img className="h-12 w-12" src="/img/logo.svg" alt="Logo" />
            </div> */}
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
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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



