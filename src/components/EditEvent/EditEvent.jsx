import { useState } from 'react';

export default function EditEvent({ event, onSave }) {
  const [editMode, setEditMode] = useState(false);
  const [editedEvent, setEditedEvent] = useState(event);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await onSave(editedEvent); // onSave should be the editEvent function passed as a prop
    setEditMode(false);
  };

  return (
    <div>
      {editMode ? (
        // Render input fields for editing
        <>
          <input type="text" name="name" value={editedEvent.name} onChange={handleChange} />
          <input type="text" name="description" value={editedEvent.description} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        // Render text for viewing
        <>
          <h2>{event.name}</h2>
          <p>{event.description}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}
    </div>
  );
}