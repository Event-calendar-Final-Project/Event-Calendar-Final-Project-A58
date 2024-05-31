import { useState } from 'react';
import WeekDay from '../WeekDay/WeekDay';

export default function CalendarWeek( {onDateClick, events} ) {

    const [currentDate, setCurrentDate] = useState(new Date());
    const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 1);
    const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6);

    let displayDate;
if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
    displayDate = `${startOfWeek.getDate()}-${endOfWeek.getDate()} ${startOfWeek.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
} else {
    displayDate = `${startOfWeek.getDate()} ${startOfWeek.toLocaleString('en-US', { month: 'long' })}-${endOfWeek.getDate()} ${endOfWeek.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
}

    const styles = {

        date: {
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer'
        },
        today: {
            backgroundColor: '#f0f0f0',
            cursor: 'pointer'
        },

        ul: {
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '10px',
            padding: '0',
            listStyleType: 'none',
        },
        li: {
            padding: '10px',
            textAlign: 'center',
        },
        today: {
            backgroundColor: '#f0f0f0',
        },
        weekSelector: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
        },
        button: {
            padding: '10px',
        },
        span: {
            flexGrow: 1,
            textAlign: 'center',
        },
    };

    
    function calendarBuilder() {
        const datesOfCurrentWeek = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            return (
                <WeekDay
                    key={`current-${i}`}
                    date={date}
                    events={events.filter(event => {
                        const eventStartDate = new Date(event.startDateTime);
                        return eventStartDate.getDate() === date.getDate() && eventStartDate.getMonth() === date.getMonth() && eventStartDate.getFullYear() === date.getFullYear();
                    })}
                    showHoursLabel={i === 0}
                />
            );
        });

        return datesOfCurrentWeek;
    }

const handlePrevWeek = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate() - 7));
};

const handleNextWeek = () => {
    setCurrentDate(nextDate => new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate() + 7));
};

return (
    <div className="CalendarWeek">
        <h1>Calendar</h1>
        <div style={styles.weekSelector}>
            <button style={styles.button} onClick={handlePrevWeek}>&lt;</button>
            <button style={styles.button} onClick={handleNextWeek}>&gt;</button>
            <span style={styles.span}>{displayDate}</span>
        </div>
        <ul style={styles.ul}>
            <li style={styles.li}>Mon</li>
            <li style={styles.li}>Tue</li>
            <li style={styles.li}>Wed</li>
            <li style={styles.li}>Thu</li>
            <li style={styles.li}>Fri</li>
            <li style={styles.li}>Sat</li>
            <li style={styles.li}>Sun</li>
        </ul>
        <ul style={styles.ul}>{calendarBuilder()}</ul>
    </div>
)
}