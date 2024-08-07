import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import './RefundRequestsManager.css';

const RefundRequestsManager = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRefundRequests = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/refundrequests`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.status === 200) {
          setRefundRequests(response.data);
        }
      } catch (error) {
        console.error('Error fetching refund requests:', error);
        setError('Failed to fetch refund requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRefundRequests();
  }, []);

  const handleMarkAsHandled = async (requestId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/admin/refundrequests/handled`, { requestId }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      // Remove the handled request from the list
      setRefundRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
    } catch (error) {
      console.error('Error marking refund request as handled:', error);
      setError('Failed to mark request as handled.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="refund-requests-manager">
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <h1>Manage Refund Requests</h1>
      {refundRequests.length === 0 ? (
        <p>No refund requests to process.</p>
      ) : (
        <ul>
          {refundRequests.map((request) => (
            <li key={request._id} className="refund-request-item">
              <p><strong>User ID:</strong> ${request.userId}</p>
              <p><strong>Refund Amount:</strong> ${request.amount}</p>
              <p><strong>IBAN:</strong> {request.iban}</p>
              <p><strong>BIC/SWIFT:</strong> {request.bic}</p>
              <p><strong>Account Holder's Name:</strong> {request.accountHolderName}</p>
              <p><strong>Account Holder's Address:</strong> {request.accountHolderAddress}</p>
              <p><strong>Bank Name:</strong> {request.bankName}</p>
              <p><strong>Bank Address:</strong> {request.bankAddress}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <p><strong>Created At:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
              <button onClick={() => handleMarkAsHandled(request._id)}>Mark as Handled</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RefundRequestsManager;
