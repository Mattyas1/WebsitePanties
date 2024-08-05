// BidHistoryList.js
import React from 'react';
import './BidHistoryList.css'; // Create a separate CSS file for styling if needed

const BidHistoryList = ({ bidHistory }) => {
    return (
        <ul className="bid-history-list">
            {[...bidHistory].reverse().map((bid, index) => (
                <li key={index} className="bid-history-item">
                    <p><strong>Produit:</strong> {bid.productName}</p>
                    <p><strong>Montant de l'offre:</strong> ${bid.bidAmount}</p>
                    <p><strong>Date de l'offre:</strong> {new Date(bid.bidDate).toLocaleString()}</p>
                </li>
            ))}
        </ul>
    );
};

export default BidHistoryList;
