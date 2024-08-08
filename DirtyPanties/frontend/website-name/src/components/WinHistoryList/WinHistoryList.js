// WinHistoryList.js
import React from 'react';
import './WinHistoryList.css';
import { useTranslation } from 'react-i18next';


const WinHistoryList = ({ winHistory }) => {
    const { t } = useTranslation();
    return (
        <ul className="win-history-list">
        {[...winHistory].reverse().map((entry, index) => (
            <li key={index} className="win-history-item">
            <p><strong>{t('product')}:</strong> {entry.productName}</p>
            <p><strong>{t('paidAmount')}:</strong> ${entry.paidAmount}</p>
            <p><strong>{t('winDate')}:</strong> {new Date(entry.winDate).toLocaleString()}</p>
            </li>
        ))}
        </ul>
    );
};

export default WinHistoryList;
