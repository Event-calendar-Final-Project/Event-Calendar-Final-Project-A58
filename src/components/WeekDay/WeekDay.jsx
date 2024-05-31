export default function WeekDay({ date, events, showHoursLabel }) {
    const styles = {
        day: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        ul: {
            display: 'flex',
            flexDirection: 'column',
            padding: '0',
            listStyleType: 'none',
        },
        li: {
            padding: '10px',
            textAlign: 'center',
        },
        hourLabel: {
            fontWeight: 'bold',
        },
        event: {
            backgroundColor: '#f0f0f0',
        },
    };

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div style={styles.day}>
            <div style={styles.date}>{date.toLocaleDateString()}</div>
            <ul style={styles.ul}>
            {hours.map(hour => {
const eventOnThisHour = events.find(event => {
    const eventStartDate = new Date(event.startDateTime);
    const eventEndDate = new Date(event.endDateTime);
    const eventStartHour = eventStartDate.getHours() + eventStartDate.getMinutes() / 60;
    const eventEndHour = eventEndDate.getHours() + eventEndDate.getMinutes() / 60;
    return hour >= eventStartHour && hour < eventEndHour && eventStartDate.getDate() === date.getDate() && eventStartDate.getMonth() === date.getMonth() && eventStartDate.getFullYear() === date.getFullYear();
});
                return (
                    <li key={hour} style={eventOnThisHour ? { ...styles.li, ...styles.event } : styles.li}>
                        {showHoursLabel && <div style={styles.hourLabel}>{`${hour}:00`}</div>}
                        {eventOnThisHour && <div>{eventOnThisHour.name}</div>}
                    </li>
                );
            })}
            </ul>
        </div>
    );
}