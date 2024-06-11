import React from 'react';
import PropTypes from 'prop-types';
import './Pagination.css';



const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  // Calculate the position of the pagination component
  const paginationPosition = itemsPerPage * 123; // Adjust the multiplier as needed
  const maxTopPosition = 400; // Adjust the maximum top position as needed

  // Determine the top position considering the maximum
  const topPosition = Math.max(paginationPosition, maxTopPosition);

  return (
    <nav style={{ position: 'fixed', top: `815px` }}>
      <ul className="pagination mt-4 mb-4">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href="#" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

  


Pagination.propTypes = {
    itemsPerPage: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    paginate: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
  };

export default Pagination;
