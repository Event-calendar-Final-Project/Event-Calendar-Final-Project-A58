import { useState } from 'react';

export default function SingleDay({ date }) {
    const styles = {
        day: {
            width: '100%',
            margin: 'auto',
        },
        daySelector: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        h1: {
            textAlign: 'center',
            marginBottom: '20px',
        },
        ul: {
            listStyleType: 'none',
            padding: '0',
            width: '100%',
            margin: '0',
        },
        li: {
            marginBottom: '10px',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        button: {
            flexGrow: 1,
            marginLeft: '10px',
            padding: '5px 0',
            border: 'none',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
        },
    };

    const [currentDate, setCurrentDate] = useState(date);
    const currentDay = currentDate.toLocaleDateString('en-GB', { weekday: 'long' });
    const currentDateString = currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

    const handlePrevDay = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate() - 1));
    };

    const handleNextDay = () => {
        setCurrentDate(nextDate => new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate() + 1));
    };

    return (
        <div style={styles.day}>
            <div style={styles.daySelector}>
                <button style={styles.button} onClick={handlePrevDay}>&lt;</button>
                <h1 style={styles.h1}>{currentDay} {currentDateString}</h1>
                <button style={styles.button} onClick={handleNextDay}>&gt;</button>
            </div>
            <ul style={styles.ul}>
                <li style={styles.li}>00:00</li>
                <li style={styles.li}>01:00</li>
                <li style={styles.li}>02:00</li>
                <li style={styles.li}>03:00</li>
                <li style={styles.li}>04:00</li>
                <li style={styles.li}>05:00</li>
                <li style={styles.li}>06:00</li>
                <li style={styles.li}>07:00</li>
                <li style={styles.li}>08:00</li>
                <li style={styles.li}>09:00</li>
                <li style={styles.li}>10:00</li>
                <li style={styles.li}>11:00</li>
                <li style={styles.li}>13:00</li>
                <li style={styles.li}>14:00</li>
                <li style={styles.li}>15:00</li>
                <li style={styles.li}>16:00</li>
                <li style={styles.li}>17:00</li>
                <li style={styles.li}>18:00</li>
                <li style={styles.li}>19:00</li>
                <li style={styles.li}>20:00</li>
                <li style={styles.li}>21:00</li>
                <li style={styles.li}>22:00</li>
                <li style={styles.li}>23:00</li>
                <li style={styles.li}>24:00</li>
            </ul>
        </div>
    );
}