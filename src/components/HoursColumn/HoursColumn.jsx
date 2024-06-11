export default function HoursColumn()  {

    const hours = Array.from({ length: 25 }, (_, i) => i);
    const styles = {
        li: {
            height: '60px',
            lineHeight: '60px',
            textAlign: 'center',
        }
    };

    return (
        <ul style={styles.ul}>
            {hours.map(hour => (
                <li key={hour} style={styles.li}>
                    {`${hour.toString().padStart(2, '0')}:00`}
                </li>
            ))}
        </ul>
    );
}