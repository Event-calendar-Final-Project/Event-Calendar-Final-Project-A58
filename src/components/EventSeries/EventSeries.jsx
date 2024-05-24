import PropTypes from 'prop-types';
import Event from '../Event/Event';

function EventSeries({ series }) {
    return (
        <div className="event-series">
            <h2>{series.title}</h2>
            <p>{series.description}</p>
            {series.events.map(event => (
                <Event key={event.id} event={event} />
            ))}
        </div>
    );
}

EventSeries.propTypes = {
    series: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        events: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            organizer: PropTypes.string.isRequired,
            createdOn: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            photoUrl: PropTypes.string,
        })).isRequired,
    }).isRequired,
};

export default EventSeries;
