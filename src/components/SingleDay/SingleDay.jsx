import './SingleDay.css'
import { useState } from 'react';
export default function SingleDay({ date }) {

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
        <div className="day">
            <div className="day-selector">
                <button onClick={handlePrevDay}>&lt;</button>
                <h1>{currentDay} {currentDateString}</h1>
                <button onClick={handleNextDay}>&gt;</button>
            </div>
            <ul>
                <li>00:00</li>
                <li>01:00</li>
                <li>02:00</li>
                <li>03:00</li>
                <li>04:00</li>
                <li>05:00</li>
                <li>06:00</li>
                <li>07:00</li>
                <li>08:00</li>
                <li>09:00</li>
                <li>10:00</li>
                <li>11:00</li>
                <li>13:00</li>
                <li>14:00</li>
                <li>15:00</li>
                <li>16:00</li>
                <li>17:00</li>
                <li>18:00</li>
                <li>19:00</li>
                <li>20:00</li>
                <li>21:00</li>
                <li>22:00</li>
                <li>23:00</li>
                <li>24:00</li>
            </ul>
        </div>
    );
}