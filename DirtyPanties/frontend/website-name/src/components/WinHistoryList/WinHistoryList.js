// WinHistoryList.js
import React from 'react';
import './WinHistoryList.css'; // Create a separate CSS file for styling if needed

const WinHistoryList = ({ winHistory }) => {
    return (
        <ul className="win-history-list">
            {[...winHistory].reverse().map((entry, index) => (
                <li key={index} className="win-history-item">
                    <p><strong>Produit:</strong> {entry.productName}</p>
                    <p><strong>Montant payé:</strong> ${entry.paidAmount}</p>
                    <p><strong>Date de victoire:</strong> {new Date(entry.winDate).toLocaleString()}</p>
                </li>
            ))}
        </ul>
    );
};

export default WinHistoryList;
