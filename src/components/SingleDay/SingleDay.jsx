import { Link } from 'react-router-dom';
import { useState } from 'react';
import HoursColumn from '../HoursColumn/HoursColumn';

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
            display: 'grid',
            gridTemplateColumns: '1fr 3fr',
            listStyleType: 'none',
            padding: '0',
            width: '100%',
            margin: '0',
        },
        li: {
            boxSizing: 'border-box', 
            height: '40px',
            lineHeight: '40px',
            textAlign: 'center',
            border: '1px solid #f0f0f0',
            backgroundColor: '#fff'
        },
        event: {
            backgroundColor: '#f0f0f0',
        },
        link: {
            color: 'inherit',
            textDecoration: 'none',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
        },
        button: {
            flexGrow: 1,
            marginLeft: '10px',
            padding: '5px 0',
            border: 'none',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
        },
        eventsColumn: { 
            marginTop: '20px',
        },
    };

    const [currentDate, setCurrentDate] = useState(date);
    const currentDay = currentDate.toLocaleDateString('en-GB', { weekday: 'long' });
    const currentDateString = currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

    const handlePrevDay = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate() - 1));
    };

    const handleNextDay = () => {
        setCurrentDate(nextDate => new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate() + 1));
    }; 

    
        const hours = Array.from({ length: 24 }, (_, i) => i);
        let lastDisplayedEvent = null;

return (
    <div style={styles.day}>
        <div style={styles.daySelector}>
            <button style={styles.button} onClick={handlePrevDay}>&lt;</button>
            <h1 style={styles.h1}>{currentDay} {currentDateString}</h1>
            <button style={styles.button} onClick={handleNextDay}>&gt;</button>
        </div>
        <div style={styles.ul}>
            <HoursColumn/>
            <div style={styles.eventsColumn}>
                <ul>
                {hours.map(hour => {
    const eventOnThisHour = events.find(event => {
        const eventStartDate = new Date(event.startDateTime);
        const eventEndDate = new Date(event.endDateTime);
        const eventStartHour = eventStartDate.getHours();
        const eventEndHour = eventEndDate.getHours();
        const eventStartDay = eventStartDate.getDate();
        const eventStartMonth = eventStartDate.getMonth();
        const eventStartYear = eventStartDate.getFullYear();

        const isSameDay = eventStartDay === currentDate.getDate() && eventStartMonth === currentDate.getMonth() && eventStartYear === currentDate.getFullYear();
        const isWithinEventHours = hour >= eventStartHour && hour < eventEndHour;

        console.log(`Event: ${event.name}`);
        console.log(`Event start date: ${eventStartDate}`);
        console.log(`Event end date: ${eventEndDate}`);
        console.log(`Event start hour: ${eventStartHour}`);
        console.log(`Event end hour: ${eventEndHour}`);
        console.log(`Current date: ${currentDate}`);
        console.log(`Current hour: ${hour}`);
        console.log(`Is same day: ${isSameDay}`);
        console.log(`Is within event hours: ${isWithinEventHours}`);

        return isSameDay && isWithinEventHours;
    });
                        const displayEvent = eventOnThisHour;
                        const displayEventName = displayEvent && eventOnThisHour !== lastDisplayedEvent;
                        lastDisplayedEvent = displayEvent ? eventOnThisHour : lastDisplayedEvent;
                        return (
                            <li key={hour} style={displayEvent ? {...styles.li, ...styles.event} : styles.li}>
                                {displayEvent ? 
                                    <Link to={`/events/${eventOnThisHour.id}`} style={styles.link}>
                                        {displayEventName ? eventOnThisHour.name : ''}
                                    </Link> :
                                    <div style={{visibility: 'hidden'}}>Placeholder</div>
                                }
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    </div>
);
}