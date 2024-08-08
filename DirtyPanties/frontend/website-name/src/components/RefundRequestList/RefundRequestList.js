// components/RefundRequestList.js
import React from 'react';
import './RefundRequestList.css';
import { useTranslation } from 'react-i18next';

const RefundRequestList = ({ requests }) => {
  const { t } = useTranslation();
  return (
    <div className="refund-request-list">
  <h2>{t('existingRefundRequests')}</h2>
  {requests.length === 0 ? (
    <p>{t('noRefundRequestsFound')}</p>
  ) : (
    <ul>
      {requests.map((request) => (
        <li key={request._id} className="refund-request-item">
          <p><strong>{t('refundAmount')}:</strong> ${request.amount}</p>
          <p className="status"><strong>{t('status')}:</strong> {request.status}</p>
          <p><strong>{t('createdOn')}:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
          <p className="note">{t('refundNote')}</p>
        </li>
      ))}
    </ul>
  )}
</div>
  );
};

export default RefundRequestList;
