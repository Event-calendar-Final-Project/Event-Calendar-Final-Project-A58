import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const styles = `
    .pagination {
      display: flex;
      list-style: none;
      padding: 0;
    }
    
    .page-item {
      margin: 0 5px;
    }
    
    .page-link {
      cursor: pointer;
      padding: 5px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-decoration: none;
      color: #007bff;
    }
    
    .page-item.active .page-link {
      background-color: #007bff;
      color: white;
      border-color: #007bff;
    }
    
    .page-link:hover {
      background-color: #ddd;
    }
  `;

  return (
    <nav style={{ position: 'fixed', top: `820px` }}>
      <style>{styles}</style>
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
  itemsPerPage: PropTypes.number,
  totalItems: PropTypes.number,
  paginate: PropTypes.func,
  currentPage: PropTypes.number,
};

export default Pagination;
