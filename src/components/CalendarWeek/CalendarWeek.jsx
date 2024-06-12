import { useState } from 'react';
import WeekDay from '../WeekDay/WeekDay';
import HoursColumn from '../HoursColumn/HoursColumn';
import PropTypes from 'prop-types';

export default function CalendarWeek({ onDateClick, events }) {

    const styles = {
        ul: {
            display: 'grid',
            gridTemplateColumns: '1fr repeat(7, 1fr)',
            gap: '0',
            padding: '0',
            margin: '0',
            listStyleType: 'none',
            width: '100%',
        },
        li: {
            margin: '0',
            padding: '0',
            textAlign: 'center',
            width: '100%',
        },
        today: {
            backgroundColor: '#f0f0f0',
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
    const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 1);
    const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6);

    let displayDate;
    if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        displayDate = `${startOfWeek.getDate()}-${endOfWeek.getDate()} ${startOfWeek.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
    } else {
        displayDate = `${startOfWeek.getDate()} ${startOfWeek.toLocaleString('en-US', { month: 'long' })}-${endOfWeek.getDate()} ${endOfWeek.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
    }

    

    function calendarBuilder() {
        const datesOfCurrentWeek = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            return date;
        });

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
            <div style={styles.weekSelector}>
                <button
                    style={{ ...styles.button, ...styles.buttonPrev }}
                    onClick={handlePrevWeek}
                    className="hover:bg-blue-700" 
                >
                    <div className="flex flex-row align-middle">
                        <svg className="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                        </svg>
                        <p className="ml-2">Prev</p>
                    </div>
                </button>
                <span div className="stat-value" style={{ margin: '0 20px' }}>{displayDate}</span>
                <button
                    style={{ ...styles.button, ...styles.buttonNext }}
                    onClick={handleNextWeek}
                    className="hover:bg-blue-700" 
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
                        context="week"
                        showHoursLabel={index === 0}
                    />
                ))}
            </ul>
        </div>
    );
}

CalendarWeek.propTypes = {
    onDateClick: PropTypes.func,
    events: PropTypes.arrayOf(PropTypes.shape({
        startDateTime: PropTypes.string,
        endDateTime: PropTypes.string,
    })),
};

CalendarWeek.defaultProps = {
    onDateClick: () => {},
    events: [],
};