import { useState } from 'react';

export default function CalendarMonth({ onDateClick, ...props }) {

    const weekDaysStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '10px',
        padding: '0',
        listStyleType: 'none',
      };
      
      const datesStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '10px',
        padding: '0',
        listStyleType: 'none',
        ...(props.shortWeekdays ? {} : { height: '100%' }),
    };

    const dateStyle = {
        width: '100%',
        cursor: props.shortWeekdays ? 'default' : 'pointer'
    };
    
    const currentDate = new Date();
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const weekdays = props.shortWeekdays ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

        let calendar = [];

        const firstMonthDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastMonthDate = new Date(currentYear, currentMonth + 1, 0).getDate();
        const lastMonthDay = new Date(currentYear, currentMonth, lastMonthDate).getDay();
        const prevMonthLastDate = new Date(currentYear, currentMonth, 0).getDate();

        const datesBeforeCurrentMonth = Array.from({ length: firstMonthDay }, (_, i) => 
            <li key={`before-${i}`} style={dateStyle} onClick={() => onDateClick(new Date(currentYear, currentMonth, i + 1))}>{prevMonthLastDate - i}</li>
        ).reverse();
        const datesOfCurrentMonth = Array.from({ length: lastMonthDate }, (_, i) => 
            <li key={`current-${i}`} style={dateStyle} onClick={() => onDateClick(new Date(currentYear, currentMonth, i + 1))}>{i + 1}</li>
        );
        const datesOfNextMonth = Array.from({ length: 6 - lastMonthDay }, (_, i) => 
            <li key={`next-${i}`} style={dateStyle} onClick={() => onDateClick(new Date(currentYear, currentMonth, i + 1))}>{i + 1}</li>
        );
        
        calendar = [...datesBeforeCurrentMonth, ...datesOfCurrentMonth, ...datesOfNextMonth];

        return calendar;

    }

    return (
        <div style={{ ...props.style, textAlign: 'center' }}>
            <div className="stat-value">Calendar</div>
            <div className="month-selector">
                <button onClick={handlePrevMonth}>&lt;</button>
                <button onClick={handleNextMonth}>&gt;</button>
                <div className="stat-value">{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(currentYear, currentMonth))}</div>
            </div>
            <ul style={weekDaysStyle}>
                {weekdays.map((day, index) => <li key={index}>{day}</li>)}
            </ul>
            <ul style={datesStyle}>
                {calendarBuilder()}
            </ul>
        </div>
    )
}