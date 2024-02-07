/* eslint-disable jsx-a11y/anchor-is-valid */
// Pagination.js
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageButtons = () => {
    const buttons = [];
   // Previous Page button
    buttons.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <a className="page-link" href="#" onClick={() => onPageChange(currentPage - 1)}>
          Previous
        </a>
      </li>
    );

    // Individual page buttons
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
          <a className="page-link" href="#" onClick={() => onPageChange(i)}>
            {i}
            {currentPage === i && <span className="sr-only">(current)</span>}
          </a>
        </li>
      );
    }

    // Next Page button
    buttons.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
        <a className="page-link" href="#" onClick={() => onPageChange(currentPage + 1)}>
          Next
        </a>
      </li>
    );

    return buttons;
  };

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-end">
        {renderPageButtons()}
      </ul>
    </nav>
  );
};

export default Pagination;
