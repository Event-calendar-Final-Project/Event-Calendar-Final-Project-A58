import { useState } from 'react';
import './CalendarMonth.css';

export default function CalendarMonth() {

    const currentDate = new Date();
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

    const handlePrevMonth = () => {
        setCurrentMonth(prevMonth => {
            if (prevMonth > 0) {
                return prevMonth - 1;
            } else {
                setCurrentYear(prevYear => prevYear - 1);
                return 11;
            }
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth(nextMonth => {
            if (nextMonth < 11) {
                return nextMonth + 1;
            } else {
                setCurrentYear(nextYear => nextYear + 1);
                return 0;
            }
        });
    };
       
    function calendarBuilder() {

        let calendar = '';

        const firstMonthDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastMonthDate = new Date(currentYear, currentMonth + 1, 0).getDate();
        const lastMonthDay = new Date(currentYear, currentMonth, lastMonthDate).getDay();
        const prevMonthLastDate = new Date(currentYear, currentMonth, 0).getDate();

        const datesBeforeCurrentMonth = Array.from({ length: firstMonthDay }, (_, i) => 
            <li key={`before-${i}`}>{prevMonthLastDate - i}</li>
        ).reverse();
        const datesOfCurrentMonth = Array.from({ length: lastMonthDate }, (_, i) => 
            <li key={`current-${i}`}>{i + 1}</li>
        );
        const datesOfNextMonth = Array.from({ length: 6 - lastMonthDay }, (_, i) => 
            <li key={`next-${i}`}>{i + 1}</li>
        );
        
        calendar = [...datesBeforeCurrentMonth, ...datesOfCurrentMonth, ...datesOfNextMonth];

        return calendar;

    }

    return (
        <div className="Calendar">
            <h1>Calendar</h1>
            <div className="month-selector">
                <button onClick={handlePrevMonth}>&lt;</button>
                <button onClick={handleNextMonth}>&gt;</button>
                <span>{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(currentYear, currentMonth))}</span>
            </div>
            <ul className="weekdays">
                <li>Mon</li>
                <li>Tue</li>
                <li>Wed</li>
                <li>Thu</li>
                <li>Fri</li>
                <li>Sat</li>
                <li>Sun</li>
            </ul>
            <ul className="dates">{calendarBuilder()}</ul>
        </div>
    )
}