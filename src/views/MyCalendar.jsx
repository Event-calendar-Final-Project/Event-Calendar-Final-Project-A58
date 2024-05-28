import CalendarMonth from '../components/CalendarMonth/CalendarMonth';

export default function MyCalendar() {

    const styles = {
        gridContainer: {
            display: 'flex',
            justifyContent: 'flex-start', 
            alignItems: 'flex-end',
            height: '60vh',
        },
        large: {
            width: '60%',
            
        },
        small: {
            width: '25%',
            alignSelf: 'flex-start',
        },
    };


    return (
        <div style={styles.gridContainer}>
            <CalendarMonth style={styles.small} />
            <CalendarMonth style={styles.large} />
        </div>
    );
}