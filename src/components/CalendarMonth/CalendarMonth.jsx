import { useState } from 'react';
import PropTypes from 'prop-types';


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

    function isDateWithinEventRange(dateToCheck) {
        
        let startOfDayToCheck = new Date(dateToCheck);
        startOfDayToCheck.setHours(0, 0, 0, 0);
    
        
        for (let event of events) {
            let startOfDayEventStart = new Date(event.startDateTime);
            startOfDayEventStart.setHours(0, 0, 0, 0);
    
            let endOfDayEventEnd = new Date(event.endDateTime);
            endOfDayEventEnd.setHours(23, 59, 59, 999);
    
            
            if (startOfDayToCheck >= startOfDayEventStart && startOfDayToCheck <= endOfDayEventEnd) {
                return true;
            }
        }
        return false;
    }

    function calendarBuilder() {
        let calendar = [];

        const firstMonthDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastMonthDate = new Date(currentYear, currentMonth + 1, 0).getDate();
        const prevMonthLastDate = new Date(currentYear, currentMonth, 0).getDate();
        const lastMonthDay = new Date(currentYear, currentMonth, lastMonthDate).getDay();
        
        const datesBeforeCurrentMonth = Array.from({ length: firstMonthDay }, (_, i) => {
            const date = new Date(currentYear, currentMonth - 1, prevMonthLastDate - i);
            const isWithinEventRange = isDateWithinEventRange(date);
            return (
                <li
                    key={`before-${i}`}
                    className={`relative flex flex-col items-center justify-center p-2 border rounded-md shadow-sm cursor-pointer transition duration-300 ease-in-out ${
                        isWithinEventRange ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'
                    } hover:shadow-md hover:border-blue-300`}
                    onClick={() => onDateClick(date)}
                >
                    {prevMonthLastDate - i}
                    {isWithinEventRange && (
                        <div className="absolute top-1 right-1">
                            <EventIcon />
                        </div>
                    )}
                </li>
            );
        }).reverse();

        const EventIcon = () => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-blue-600"
            >
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 7h14v2H5V7zm0 12V11h14v8H5z"/>
            </svg>
        );
        
        const datesOfCurrentMonth = Array.from({ length: lastMonthDate }, (_, i) => {
            const date = new Date(currentYear, currentMonth, i + 1);
            const isWithinEventRange = isDateWithinEventRange(date);
            return (
                <li
                    key={`current-${i}`}
                    className={`relative flex flex-col items-center justify-center p-2 border rounded-md shadow-sm cursor-pointer transition duration-300 ease-in-out ${
                        isWithinEventRange ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'
                    } hover:shadow-md hover:border-blue-300`}
                    onClick={() => onDateClick(date)}
                >
                    <span className="text-lg font-semibold">{i + 1}</span>
                    {isWithinEventRange && (
                        <div className="absolute top-1 right-1">
                            <EventIcon />
                        </div>
                    )}
                </li>
            );
        });

        const datesOfNextMonth = Array.from({ length: 6 - lastMonthDay }, (_, i) => {
            const date = new Date(currentYear, currentMonth + 1, i + 1);
            const isWithinEventRange = isDateWithinEventRange(date);
            return (
                <li
                    key={`next-${i}`}
                    className={`relative flex flex-col items-center justify-center p-2 border rounded-md shadow-sm cursor-pointer transition duration-300 ease-in-out ${
                        isWithinEventRange ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'
                    } hover:shadow-md hover:border-blue-300`}
                    onClick={() => onDateClick(date)}
                >
                    {i + 1}
                    {isWithinEventRange && (
                        <div className="absolute top-1 right-1">
                            <EventIcon />
                        </div>
                    )}
                </li>
            );
        });

        calendar = [...datesBeforeCurrentMonth, ...datesOfCurrentMonth, ...datesOfNextMonth];

        return calendar;
    }

    return (
        <div style={{ ...props.style, textAlign: 'center' }}>
            <div className="month-selector" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button onClick={handlePrevMonth} type="button" className="btn min-w-auto w-32 h-10 bg-red-300 p-2 rounded-xl hover:bg-red-500 transition-colors duration-50 hover:animate-pulse ease-out text-white font-semibold">
                    <div className="flex flex-row align-middle m-2">
                        <svg className="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                        </svg>
                        <p className="ml-2">Prev</p>
                    </div>
                </button>
                <div className="stat-value" style={{ margin: '0 20px' }}>
                    {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(currentYear, currentMonth))}
                </div>
                <button onClick={handleNextMonth} type="button" className="btn min-w-auto w-32 h-10 bg-green-300 p-2 rounded-xl hover:bg-green-500 transition-colors duration-50 hover:animate-pulse ease-out text-white font-semibold">
                    <div className="flex flex-row align-middle p-2">
                        <span className="mr-2">Next</span>
                        <svg className="w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                </button>
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

CalendarMonth.propTypes = {
    onDateClick: PropTypes.func.isRequired,
    events: PropTypes.arrayOf(PropTypes.shape({
        startDateTime: PropTypes.string.isRequired,
        endDateTime: PropTypes.string.isRequired,
    })).isRequired,
    shortWeekdays: PropTypes.string.isRequired,
    style: PropTypes.object,
};

