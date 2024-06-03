export default function HoursColumn()  {

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const styles = {
        li: {
            height: '40px',
            lineHeight: '40px',
            textAlign: 'center',
        },
        ul: {
            marginTop: '-20px'
        }
    };

    return (
        <ul style={styles.ul}>
            <li style={styles.li}></li>
            {hours.map(hour => (
                <li key={hour} style={styles.li}>
                    {`${hour}:00`}
                </li>
            ))}
        </ul>
    );
}