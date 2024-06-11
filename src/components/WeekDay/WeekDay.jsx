import { Link } from "react-router-dom";

export default function WeekDay({ date, events, showDate = true }) {
    const styles = {
        day: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0',
            padding: '0',
            width: '100%', // Ensure the parent container has a defined width
            height: '100%', // Ensure the parent container has a defined height
        },
        link: {
            color: 'inherit',
            textDecoration: 'none',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        ul: {
            display: 'flex',
            flexDirection: 'column',
            padding: '0',
            listStyleType: 'none',
            width: '100%', 
        },
        li: {
            boxSizing: 'border-box',
            height: '1px',
            lineHeight: '1px',
            textAlign: 'center',
            width: '100%',
            backgroundColor: '#fff',
            borderLeft: '1px solid black',
            borderRight: '1px solid black',
            minWidth: '100%',
            flexGrow: 1,
        },
        event: {
            backgroundColor: '#f0f0f0',
        },
        date: {
            height: '60px',
            lineHeight: '60px',
        },
    };

    // Generate time slots for every minute of the day
    const timeSlots = Array.from({ length: 24 * 60 }, (_, i) => {
        const hour = Math.floor(i / 60);
        const minutes = i % 60;
        return { hour, minutes };
    });
    let occupiedSlots = {};

    return (
        <div style={styles.day}>
            {showDate && <div style={styles.date}>{date.toLocaleDateString('bg-BG', { timeZone: 'Europe/Sofia' })}</div>}
            <ul style={styles.ul}>
                {timeSlots.map((slot, index) => {
                    if (occupiedSlots[index]) {
                        return null;
                    }

                    const eventOnThisSlot = events.find(event => {
                        const eventStartDate = new Date(event.startDateTime);
                        const eventEndDate = new Date(event.endDateTime);
                        const slotDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), slot.hour, slot.minutes);
                        return slotDate >= eventStartDate && slotDate < eventEndDate;
                    });

                    if (eventOnThisSlot) {
                        const eventStartDate = new Date(eventOnThisSlot.startDateTime);
                        const eventEndDate = new Date(eventOnThisSlot.endDateTime);
                        const durationInMinutes = (eventEndDate - eventStartDate) / (1000 * 60);
                        const slotSpan = Math.ceil(durationInMinutes); // Adjusted for 1-minute precision

                        for (let i = 1; i < slotSpan; i++) {
                            occupiedSlots[index + i] = true;
                        }

                        return (
                            <li key={index} style={{...styles.li, ...styles.event, height: `${slotSpan}px`, lineHeight: `${slotSpan}px`}}>
                                <Link to={`/events/${eventOnThisSlot.id}`} style={styles.link}>
                                    {eventOnThisSlot.name}
                                </Link>
                            </li>
                        );
                    }

                        const additionalStyle = index % 60 === 0 ? { borderTop: '1px solid black' } : {};

                    return (
                        <li key={index} style={{...styles.li, ...additionalStyle}}></li>
                    );
                })}
            </ul>
        </div>
    );
}