import { useState } from 'react';

export default function CalendarMonth({ onDateClick, events, ...props }) {

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
    console.log(events)
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
    
    function hasEvent(date) {
        return events.some(event => {
            const startDate = new Date(event.startDateTime);
    
            return startDate.getDate() === date.getDate() &&
                   startDate.getMonth() === date.getMonth() &&
                   startDate.getFullYear() === date.getFullYear();
        });
    }

function calendarBuilder() {
    let calendar = [];

    const firstMonthDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastMonthDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthLastDate = new Date(currentYear, currentMonth, 0).getDate();
    const lastMonthDay = new Date(currentYear, currentMonth, lastMonthDate).getDay();

    const datesBeforeCurrentMonth = Array.from({ length: firstMonthDay }, (_, i) => {
        const date = new Date(currentYear, currentMonth - 1, prevMonthLastDate - i);
        const hasEventOnDate = hasEvent(date);
        return (
            <li 
                key={`before-${i}`} 
                style={{ ...dateStyle, backgroundColor: hasEventOnDate ? 'red' : 'transparent' }} 
                onClick={() => onDateClick(date)}
            >
                {prevMonthLastDate - i}
            </li>
        );
    }).reverse();

    const datesOfCurrentMonth = Array.from({ length: lastMonthDate }, (_, i) => {
        const date = new Date(currentYear, currentMonth, i + 1);
        const hasEventOnDate = hasEvent(date);
        return (
            <li 
                key={`current-${i}`} 
                style={{ ...dateStyle, backgroundColor: hasEventOnDate ? 'red' : 'transparent' }} 
                onClick={() => onDateClick(date)}
            >
                {i + 1}
            </li>
        );
    });

    const datesOfNextMonth = Array.from({ length: 6 - lastMonthDay }, (_, i) => {
        const date = new Date(currentYear, currentMonth + 1, i + 1);
        const hasEventOnDate = hasEvent(date);
        return (
            <li 
                key={`next-${i}`} 
                style={{ ...dateStyle, backgroundColor: hasEventOnDate ? 'red' : 'transparent' }} 
                onClick={() => onDateClick(date)}
            >
                {i + 1}
            </li>
        );
    });

    calendar = [...datesBeforeCurrentMonth, ...datesOfCurrentMonth, ...datesOfNextMonth];

    return calendar;
}

return (
    <div style={{ ...props.style, textAlign: 'center' }}>
        <div className="stat-value">Calendar</div>
        <div className="month-selector">
            <button onClick={handlePrevMonth} className="btn btn-info btn-square">&lt;</button>
            <button onClick={handleNextMonth} className="btn btn-info btn-square">&gt;</button>
            <div className="stat-value" >{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(currentYear, currentMonth))}</div>
        </div>
        <ul style={{ ...weekDaysStyle, fontSize: '20px' }}>
            {weekdays.map((day, index) => <li key={index}>{day}</li>)}
        </ul>
        <ul style={datesStyle}>
            {events && calendarBuilder()}
        </ul>
    </div>
)
}