import { useState, useEffect, useContext } from 'react';
import CalendarMonth from '../components/CalendarMonth/CalendarMonth';
import CalendarWeek from '../components/CalendarWeek/CalendarWeek';
import CalendarWorkWeek from '../components/CalendarWorkWeek/CalendarWorkWeek';
import SingleDay from '../components/SingleDay/SingleDay';
import { AppContext } from '../context/AppContext';
import { getAllEvents } from '../services/event.service';
import CreateMap from '../components/Map/Map';

export default function MyCalendar() {
    const [view, setView] = useState('month');
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const { userData } = useContext(AppContext)

useEffect(() => {
  getAllEvents('').then((allEvents) => {
    console.log(allEvents);
    let filteredEvents = allEvents.filter(event => {
      return event.type === 'private' && 
        (event.author === userData.handle || Object.keys(event.invitedUsers ?? {}).includes(userData.handle))
    });
    setEvents(filteredEvents);
  });
}, [userData]);
console.log(events);
    



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
                    <button  className="btn min-w-auto w-32 h-10 bg-blue-300 p-2 rounded-xl hover:bg-blue-500 transition-colors duration-50 hover:animate-pulse ease-out text-white font-semibold" onClick={() => setView('month')}>Month</button>
                    <button  className="btn min-w-auto w-32 h-10 bg-blue-300 p-2 rounded-xl hover:bg-blue-500 transition-colors duration-50 hover:animate-pulse ease-out text-white font-semibold" onClick={() => setView('week')}>Week</button>
                    <button  className="btn min-w-auto w-32 h-10 bg-blue-300 p-2 rounded-xl hover:bg-blue-500 transition-colors duration-50 hover:animate-pulse ease-out text-white font-semibold" onClick={() => setView('workweek')}>Work Week</button>
                    <button  className="btn min-w-auto w-32 h-10 bg-blue-300 p-2 rounded-xl hover:bg-blue-500 transition-colors duration-50 hover:animate-pulse ease-out text-white font-semibold" onClick={() => {
                        setView('day');
                        setSelectedDate(new Date());
                    }}>Day</button>
                </div>
                {renderView()}
            </div>
        </div>
              
    );
}