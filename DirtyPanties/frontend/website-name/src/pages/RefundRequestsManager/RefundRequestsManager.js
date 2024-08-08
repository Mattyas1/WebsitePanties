import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import './RefundRequestsManager.css';
import { useTranslation } from 'react-i18next';


const RefundRequestsManager = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();


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
  <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
  <h1>{t('manageRefundRequests')}</h1>
  {refundRequests.length === 0 ? (
    <p>{t('noRefundRequests')}</p>
  ) : (
    <ul>
      {refundRequests.map((request) => (
        <li key={request._id} className="refund-request-item">
          <p><strong>{t('userId')}:</strong> {request.userId}</p>
          <p><strong>{t('refundAmount')}:</strong> ${request.amount}</p>
          <p><strong>{t('iban')}:</strong> {request.iban}</p>
          <p><strong>{t('bic')}:</strong> {request.bic}</p>
          <p><strong>{t('accountHolderName')}:</strong> {request.accountHolderName}</p>
          <p><strong>{t('accountHolderAddress')}:</strong> {request.accountHolderAddress}</p>
          <p><strong>{t('bankName')}:</strong> {request.bankName}</p>
          <p><strong>{t('bankAddress')}:</strong> {request.bankAddress}</p>
          <p><strong>{t('status')}:</strong> {request.status}</p>
          <p><strong>{t('createdAt')}:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
          <button onClick={() => handleMarkAsHandled(request._id)}>{t('markAsHandled')}</button>
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default RefundRequestsManager;
