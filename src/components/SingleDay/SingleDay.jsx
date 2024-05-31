import { useState } from 'react';

export default function SingleDay({ date, events }) {
    const styles = {
        day: {
            width: '100%',
            margin: 'auto',
        },
        daySelector: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        h1: {
            textAlign: 'center',
            marginBottom: '20px',
        },
        ul: {
            listStyleType: 'none',
            padding: '0',
            width: '100%',
            margin: '0',
        },
        li: {
            marginBottom: '10px',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        button: {
            flexGrow: 1,
            marginLeft: '10px',
            padding: '5px 0',
            border: 'none',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
        },
    };

    const [currentDate, setCurrentDate] = useState(date);
    const currentDay = currentDate.toLocaleDateString('en-GB', { weekday: 'long' });
    const currentDateString = currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    const hours = Array.from({ length: 24 }, (_, i) => i);
    console.log('events:', events);

    const handlePrevDay = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate() - 1));
    };

    const handleNextDay = () => {
        setCurrentDate(nextDate => new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate() + 1));
    };

    return (
        <div style={styles.day}>
            <div style={styles.daySelector}>
                <button style={styles.button} onClick={handlePrevDay}>&lt;</button>
                <h1 style={styles.h1}>{currentDay} {currentDateString}</h1>
                <button style={styles.button} onClick={handleNextDay}>&gt;</button>
            </div>
            <ul style={styles.ul}>
            {hours.map(hour => {
    const eventOnThisHour = events.find(event => {
        const eventStartDate = new Date(event.startDateTime);
        const eventEndDate = new Date(event.endDateTime);
        return eventStartDate.getHours() <= hour && eventEndDate.getHours() > hour && eventStartDate.getDate() === currentDate.getDate() && eventStartDate.getMonth() === currentDate.getMonth() && eventStartDate.getFullYear() === currentDate.getFullYear();
    });
    return (
        <li key={hour} style={eventOnThisHour ? { ...styles.li, backgroundColor: '#f0f0f0' } : styles.li}>
            {hour}:00
            {eventOnThisHour && <div>{eventOnThisHour.name}</div>}
        </li>
    );
})}
            </ul>
        </div>
    );
}
