import React, { useEffect, useContext, useState } from 'react';
import './History.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import { AuthContext } from '../../context/AuthContext';

const History = () => {
    const { setUser, user } = useContext(AuthContext);
    const [initialLoad, setInitialLoad] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async (userId) => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/user/${userId}`);
                console.log(response.data);
                setUser(response.data);
                setInitialLoad(false); // Update flag to prevent future refetches
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (initialLoad && user && user._id) {
            fetchUser(user._id);
        }
    }, [user, initialLoad, setUser]);

    return (
        <div>
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            <div className="history-container">
                <h2>Historique des Enchères</h2>
                {user && user.bidHistory && user.bidHistory.length > 0 ? (
                    <ul className="bid-history-list">
                        {[...user.bidHistory].reverse().map((bid, index) => (
                            <li key={index} className="bid-history-item">
                                <p><strong>Produit:</strong> {bid.productName}</p>
                                <p><strong>Montant de l'enchère:</strong> ${bid.bidAmount}</p>
                                <p><strong>Date de l'enchère:</strong> {new Date(bid.bidDate).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucune enchère trouvée.</p>
                )}
            </div>
        </div>
    );
};

export default History;
