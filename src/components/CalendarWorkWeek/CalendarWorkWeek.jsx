import { useState } from 'react';

export default function CalendarWorkWeek() {

    const ulStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px',
        padding: '0',
        listStyleType: 'none',
    };

    const liStyle = {
        padding: '10px',
        textAlign: 'center',
    };

    const liTodayStyle = {
        backgroundColor: '#f0f0f0',
    };

    const weekSelectorStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    };

    const buttonStyle = {
        padding: '5px 10px',
        border: 'none',
        backgroundColor: '#ddd',
        cursor: 'pointer',
    };

    
    const spanStyle = {
        fontSize: '1.2em',
        fontWeight: 'bold',
    };

    const [currentDate, setCurrentDate] = useState(new Date());

    const adjustedDay = currentDate.getDay() === 0 ? 7 : currentDate.getDay();


    const startOfWeekDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - adjustedDay + 1);
    const endOfWeekDate = new Date(startOfWeekDate.getFullYear(), startOfWeekDate.getMonth(), startOfWeekDate.getDate() + 4);

    const calendarBuilder = () => {
        const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const datesOfCurrentMonth = Array.from({ length: lastMonthDate }, (_, i) => 
            <li key={`current-${i}`}>{i + 1}</li>
        );

        
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
            <div className="week-selector" style={weekSelectorStyle}>
                <button style={buttonStyle} onClick={handlePrevWeek}>&lt;</button>
                <button style={buttonStyle} onClick={handleNextWeek}>&gt;</button>
                <span style={spanStyle}>{displayDate}</span>
            </div>
            <ul style={ulStyle}>
                <li style={liStyle}>Mon</li>
                <li style={liStyle}>Tue</li>
                <li style={liStyle}>Wed</li>
                <li style={liStyle}>Thu</li>
                <li style={liStyle}>Fri</li>
            </ul>
            <ul style={ulStyle}>{calendarBuilder()}</ul>
        </div>
    )
}