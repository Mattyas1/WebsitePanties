// components/RefundRequestList.js
import React from 'react';
import './RefundRequestList.css'; // Import the styles

const RefundRequestList = ({ requests }) => {
  return (
    <div className="refund-request-list">
      <h2>Existing Refund Requests</h2>
      {requests.length === 0 ? (
        <p>No refund requests found.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request._id} className="refund-request-item">
              <p><strong>Refund Amount:</strong> ${request.amount}</p>
              <p className="status"><strong>Status:</strong> {request.status}</p>
              <p><strong>Created On:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
              <p className="note">Note: Refunds can take up to 2 weeks to be processed. Please make sure the above information is correct. Lust Auction will not be held responsible if not.</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RefundRequestList;
