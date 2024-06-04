import { Link } from "react-router-dom";

export default function WeekDay({ date, events, context }) {
    const styles = {
        day: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0',
            padding: '0', 
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
        ul: {
            display: 'flex',
            flexDirection: 'column',
            padding: '0',
            listStyleType: 'none',
        },
        li: {
            boxSizing: 'border-box', 
            height: '40px',
            lineHeight: '40px',
            textAlign: 'center',
            border: '1px solid #f0f0f0',
            width: context === 'workweek' ? '195px' : '145px',
            backgroundColor: '#fff'
        },
        event: {
            backgroundColor: '#f0f0f0',
        },
        date: {
            height: '40px',
            lineHeight: '40px', 
        },
    };

    
    const hours = Array.from({ length: 24 }, (_, i) => i);
    let lastDisplayedEvent = null;

    return (
        <div style={styles.day}>
            <div style={styles.date}>{date.toLocaleDateString('bg-BG', { timeZone: 'Europe/Sofia' })}</div>
            <ul style={styles.ul}>
                {hours.map(hour => {
                    const eventOnThisHour = events.find(event => {
                        const eventStartDate = new Date(event.startDateTime);
                        const eventEndDate = new Date(event.endDateTime);
                        const eventStartHour = eventStartDate.getHours();
                        const eventEndHour = eventEndDate.getHours();
                        return hour >= eventStartHour && hour < eventEndHour && eventStartDate.getDate() === date.getDate() && eventStartDate.getMonth() === date.getMonth() && eventStartDate.getFullYear() === date.getFullYear();
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
    );
}