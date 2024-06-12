import { useState } from 'react';
import WeekDay from '../WeekDay/WeekDay';
import HoursColumn from '../HoursColumn/HoursColumn';
import PropTypes from 'prop-types';

export default function CalendarWorkWeek({ onDateClick, events }) {
    const styles = {
        ul: {
            display: 'grid',
            gridTemplateColumns: '1fr repeat(5, 1fr)',
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
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
        },
        button: {
            backgroundColor: '#2d3748', 
            color: 'white',
            padding: '10px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        buttonPrev: {
            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px',
            borderRight: '1px solid #d1d5db', 
        },
        buttonNext: {
            borderTopRightRadius: '4px',
            borderBottomRightRadius: '4px',
            borderLeft: '1px solid #e5e7eb', 
        },
        span: {
            textAlign: 'center',
            fontSize: '20px',
            margin: '0 10px',
        },
        hoursColumn: {
            marginTop: '40px',
        },
    };

    const [currentDate, setCurrentDate] = useState(new Date());

    const adjustedDay = currentDate.getDay() === 0 ? 7 : currentDate.getDay();

    const startOfWeekDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - adjustedDay + 1);
    const endOfWeekDate = new Date(startOfWeekDate.getFullYear(), startOfWeekDate.getMonth(), startOfWeekDate.getDate() + 4);

    const calendarBuilder = () => {
        const datesOfWorkWeek = Array.from({ length: 5 }, (_, i) => {
            const date = new Date(startOfWeekDate);
            date.setDate(date.getDate() + i);
            return date;
        });

        return datesOfWorkWeek;
    };

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
            <div className="week-selector" style={styles.weekSelector}>
                <button
                    style={{ ...styles.button, ...styles.buttonPrev }}
                    onClick={handlePrevWeek}
                    className="hover:bg-blue-700" // Tailwind class for hover effect
                >
                    <div className="flex flex-row align-middle">
                        <svg className="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                        </svg>
                        <p className="ml-2">Prev</p>
                    </div>
                </button>
                <span className="stat-value" style={{ margin: '0 20px' }}>{displayDate}</span>
                <button
                    style={{ ...styles.button, ...styles.buttonNext }}
                    onClick={handleNextWeek}
                    className="hover:bg-blue-700" // Tailwind class for hover effect
                >
                    <div className="flex flex-row align-middle">
                        <span className="mr-2">Next</span>
                        <svg className="w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                </button>
            </div>
            <ul style={styles.ul}>
                <div style={styles.hoursColumn}>
                    <HoursColumn />
                </div>
                {calendarBuilder().map((date, index) => (
                    <WeekDay
                        key={index}
                        date={date}
                        events={events}
                        context="workweek"
                        showHoursLabel={index === 0}
                    />
                ))}
            </ul>
        </div>
    );
}

CalendarWorkWeek.propTypes = {
    onDateClick: PropTypes.func,
    events: PropTypes.arrayOf(PropTypes.shape({
        startDateTime: PropTypes.string,
        endDateTime: PropTypes.string,
    })).isRequired,
};

CalendarWorkWeek.defaultProps = {
    onDateClick: () => {},
    events: [],
};