import { useState } from 'react';
import CalendarMonth from '../components/CalendarMonth/CalendarMonth';
import CalendarWeek from '../components/CalendarWeek/CalendarWeek';
import CalendarWorkWeek from '../components/CalendarWorkWeek/CalendarWorkWeek';
import SingleDay from '../components/SingleDay/SingleDay';
export default function MyCalendar() {
    const [view, setView] = useState('month');

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
                return <CalendarWeek style={styles.large} />;
            case 'workweek':
                return <CalendarWorkWeek style={styles.large} />;
            case 'day':
                return <SingleDay style={styles.large} />;
            default:
                return <CalendarMonth style={styles.large} />;
        }
    };

    return (
        <div style={styles.gridContainer}>
            <CalendarMonth style={styles.small} shortWeekdays={true} />
            <div style={styles.largeContainer}>
                <div style={styles.buttonContainer}>
                    <button onClick={() => setView('month')}>Month</button>
                    <button onClick={() => setView('week')}>Week</button>
                    <button onClick={() => setView('workweek')}>Work Week</button>
                    <button onClick={() => setView('day')}>Day</button>
                </div>
                {renderView()}
            </div>
        </div>
    );
}