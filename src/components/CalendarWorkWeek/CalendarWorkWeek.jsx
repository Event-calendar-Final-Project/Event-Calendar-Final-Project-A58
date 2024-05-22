import './CalendarWorkWeek.css'
import { useState } from 'react';

export default function CalendarWorkWeek() {

    const [currentDate, setCurrentDate] = useState(new Date());

    const adjustedDay = currentDate.getDay() === 0 ? 7 : currentDate.getDay();

    // Calculate the start and end of the week
    const startOfWeek = currentDate.getDate() - adjustedDay + 1;
    const endOfWeek = startOfWeek + 4;

const calendarBuilder = () => {
    
    const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const datesOfCurrentMonth = Array.from({ length: lastMonthDate }, (_, i) => 
        <li key={`current-${i}`}>{i + 1}</li>
    );


    // Filter the dates to only include the workdays in the current week
    const datesOfWorkWeek = datesOfCurrentMonth.filter((_, i) => 
        i >= startOfWeek && i <= endOfWeek
    );

    return datesOfWorkWeek;
}

const handlePrevWeek = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate() - 7));
};

const handleNextWeek = () => {
    setCurrentDate(nextDate => new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate() + 7));
};

return (
    <div className="CalendarWorkWeek">
        <h1>Calendar</h1>
        <div className="week-selector">
            <button onClick={handlePrevWeek}>&lt;</button>
            <button onClick={handleNextWeek}>&gt;</button>
            <span>{`${startOfWeek}-${endOfWeek} ${currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`}</span>
        </div>
        <ul>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
        </ul>
    </div>
)
}