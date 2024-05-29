import './CalendarWeek.css';
import { useState } from 'react';

export default function CalendarWeek() {

    const [currentDate, setCurrentDate] = useState(new Date());

    const styles = {
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
    
    
    const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const datesOfCurrentMonth = Array.from({ length: lastMonthDate }, (_, i) => 
        <li key={`current-${i}`}>{i + 1}</li>
    );


    


    const startOfWeek = currentDate.getDate() - currentDate.getDay();
    const endOfWeek = startOfWeek + 6;


    const datesOfCurrentWeek = datesOfCurrentMonth.filter((_, i) => 
        i >= startOfWeek && i <= endOfWeek
    );

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
            <span style={styles.span}>{`${currentDate.getDate() - currentDate.getDay() + 1}-${currentDate.getDate() - currentDate.getDay() + 7} ${currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`}</span>
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