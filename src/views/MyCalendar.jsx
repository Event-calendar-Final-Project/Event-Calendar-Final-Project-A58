import { useState, useEffect, useContext } from 'react';
import CalendarMonth from '../components/CalendarMonth/CalendarMonth';
import CalendarWeek from '../components/CalendarWeek/CalendarWeek';
import CalendarWorkWeek from '../components/CalendarWorkWeek/CalendarWorkWeek';
import SingleDay from '../components/SingleDay/SingleDay';
import { getMyEvents } from '../services/event.service';
import { AppContext } from '../context/AppContext';
import { getEventById } from '../services/event.service';

export default function MyCalendar() {
    const [view, setView] = useState('month');
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const { userData } = useContext(AppContext)

    useEffect(() => {
        getMyEvents(userData.handle).then((eventIds) => {
            Promise.all(eventIds.map((event) => getEventById(event[0])))
                .then((allEvents) => {
                    setEvents(allEvents);
                });
        });
    }, []);



    const styles = {
        gridContainer: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            marginTop: '5%',
            marginLeft: '2%',
        },
        largeContainer: {
            width: '70%',
            marginLeft: '5%',
            height: '80vh',
        },
        large: {
            width: '100%',
            height: '100%',
        },
        small: {
            width: '15%',
            marginRight: '0%',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
        },
    };

    const renderView = () => {
        switch (view) {
            case 'week':
                return (
                    <CalendarWeek
                        style={styles.large}
                        events={events}
                        onDateClick={(date) => {
                            setView('day');
                            setSelectedDate(date);
                        }}
                    />
                );
            case 'workweek':
                return (
                    <CalendarWorkWeek
                        style={styles.large}
                        events={events}
                        onDateClick={(date) => {
                            setView('day');
                            setSelectedDate(date);
                        }}
                    />
                );
            case 'day':
                return <SingleDay style={styles.large} date={selectedDate} events={events} />;
            default:
                return (
                    <CalendarMonth
                        style={styles.large}
                        events ={events}
                        onDateClick={(date) => {
                            setView('day');
                            setSelectedDate(date);
                        }}
                    />
                );
        }
    };

    return (
        <div style={styles.gridContainer}>
            <CalendarMonth style={styles.small} shortWeekdays={true} events={events} />
            <div style={styles.largeContainer}>
                <div style={styles.buttonContainer}>
                    <button onClick={() => setView('month')}>Month</button>
                    <button onClick={() => setView('week')}>Week</button>
                    <button onClick={() => setView('workweek')}>Work Week</button>
                    <button onClick={() => {
                        setView('day');
                        setSelectedDate(new Date());
                    }}>Day</button>
                </div>
                {renderView()}
            </div>
        </div>
    );
}