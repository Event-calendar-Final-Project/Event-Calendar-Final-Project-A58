import PropTypes from 'prop-types';
export default function UserData({ user }) {
    return (
        <div>
            <h1>{user.handle}</h1>
            <p>{user.email}</p>
        </div>
    );
}

UserData.propTypes = {
    user: PropTypes.shape({
        handle: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
    }).isRequired,
};