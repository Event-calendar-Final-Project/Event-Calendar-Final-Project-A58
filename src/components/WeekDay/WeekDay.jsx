export default function WeekDay({ date, events, context }) {
    const styles = {
        day: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0',
            padding: '0', 
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
            width: context === 'workweek' ? '195px' : '145px'
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
                        console.log(eventStartHour)
                        console.log(eventEndHour)
                        return hour >= eventStartHour && hour < eventEndHour && eventStartDate.getDate() === date.getDate() && eventStartDate.getMonth() === date.getMonth() && eventStartDate.getFullYear() === date.getFullYear();
                    });
                    return (
                        <li key={hour} style={styles.li}>
                            {eventOnThisHour ? <div>{eventOnThisHour.name}</div> : <div style={{visibility: 'hidden'}}>Placeholder</div>}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}