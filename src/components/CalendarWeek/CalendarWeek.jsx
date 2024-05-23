import './CalendarWeek.css';
import { useState } from 'react';

export default function CalendarWeek() {

    const [currentDate, setCurrentDate] = useState(new Date());

function calendarBuilder() {
    
    
    const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const datesOfCurrentMonth = Array.from({ length: lastMonthDate }, (_, i) => 
        <li key={`current-${i}`}>{i + 1}</li>
    );

    // Get the current date
    

    // Get the start and end dates of the current week
    const startOfWeek = currentDate.getDate() - currentDate.getDay();
    const endOfWeek = startOfWeek + 6;

    // Filter the dates to only include the dates in the current week
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
        <div className="week-selector">
            <button onClick={handlePrevWeek}>&lt;</button>
            <button onClick={handleNextWeek}>&gt;</button>
            <span>{`${currentDate.getDate() - currentDate.getDay() + 1}-${currentDate.getDate() - currentDate.getDay() + 7} ${currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`}</span>
        </div>
        <ul>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
            <li>Sun</li>
        </ul>
        <ul>{calendarBuilder()}</ul>
    </div>
)
}