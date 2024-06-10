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
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
        },
        h1: {
            textAlign: 'center',
            margin: '0 10px',
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
            backgroundColor: '#2d3748', // Tailwind bg-gray-800
            color: 'white',
            padding: '10px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        buttonPrev: {
            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px',
            borderRight: '1px solid #d1d5db', // Tailwind border-gray-100
        },
        buttonNext: {
            borderTopRightRadius: '4px',
            borderBottomRightRadius: '4px',
            borderLeft: '1px solid #e5e7eb', // Tailwind border-gray-200
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
                <button
                    style={{ ...styles.button, ...styles.buttonPrev }}
                    onClick={handlePrevDay}
                    className="hover:bg-blue-700" 
                >
                    <div className="flex flex-row align-middle">
                        <svg className="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                        </svg>
                        <p className="ml-2">Prev</p>
                    </div>
                </button>
                <h1 div className="stat-value" style={{ margin: '0 20px' }}>{currentDay} {currentDateString}</h1>
                <button
                    style={{ ...styles.button, ...styles.buttonNext }}
                    onClick={handleNextDay}
                    className="hover:bg-blue-700" 
                >
                    <div className="flex flex-row align-middle">
                        <span className="mr-2">Next</span>
                        <svg className="w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                </button>
            </div>
            <div style={styles.ul}>
                <HoursColumn />
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

                                return isSameDay && isWithinEventHours;
                            });
                            const displayEvent = eventOnThisHour;
                            const displayEventName = displayEvent && eventOnThisHour !== lastDisplayedEvent;
                            lastDisplayedEvent = displayEvent ? eventOnThisHour : lastDisplayedEvent;
                            return (
                                <li key={hour} style={displayEvent ? { ...styles.li, ...styles.event } : styles.li}>
                                    {displayEvent ?
                                        <Link to={`/events/${eventOnThisHour.id}`} style={styles.link}>
                                            {displayEventName ? eventOnThisHour.name : ''}
                                        </Link> :
                                        <div style={{ visibility: 'hidden' }}>Placeholder</div>
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