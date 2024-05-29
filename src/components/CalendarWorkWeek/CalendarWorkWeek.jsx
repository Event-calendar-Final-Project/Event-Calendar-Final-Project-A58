import { useState } from 'react';

export default function CalendarWorkWeek( { onDateClick } ) {

    const styles = {
        ul: {
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '10px',
            padding: '0',
            listStyleType: 'none',
        },
        li: {
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
        },
        today: {
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
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
    
        const [currentDate, setCurrentDate] = useState(new Date());
    
        const adjustedDay = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
    
    
        const startOfWeekDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - adjustedDay + 1);
        const endOfWeekDate = new Date(startOfWeekDate.getFullYear(), startOfWeekDate.getMonth(), startOfWeekDate.getDate() + 4);
    
        const calendarBuilder = () => {
            const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            const datesOfCurrentMonth = Array.from({ length: lastMonthDate }, (_, i) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                const isToday = date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
                return (
                    <li key={`current-${i}`} style={isToday ? styles.today : styles.li} onClick={() => onDateClick(date)}>{date.getDate()}</li>
                );
            });
        
            const datesOfWorkWeek = datesOfCurrentMonth.filter((_, i) => 
                i >= startOfWeekDate.getDate() - 1 && i <= endOfWeekDate.getDate() - 1
            );
        
            return datesOfWorkWeek;
        }

    
        const handlePrevWeek = () => {
            setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate() - 7));
        };
    
        const handleNextWeek = () => {
            setCurrentDate(nextDate => new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate() + 7));
        };
    
        let displayDate;
        if (startOfWeekDate.getMonth() === endOfWeekDate.getMonth()) {
            displayDate = `${startOfWeekDate.getDate()}-${endOfWeekDate.getDate()} ${startOfWeekDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
        } else {
            displayDate = `${startOfWeekDate.getDate()} ${startOfWeekDate.toLocaleString('en-US', { month: 'long' })}-${endOfWeekDate.getDate()} ${endOfWeekDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
        }
    
return (
    <div className="CalendarWorkWeek">
        <h1>Calendar</h1>
        <div className="week-selector" style={styles.weekSelector}>
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
            {calendarBuilder()}
        </ul>
    </div>
);
    }

    