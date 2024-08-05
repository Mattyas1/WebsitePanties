import React, { useEffect, useContext, useState } from 'react';
import './History.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import { AuthContext } from '../../context/AuthContext';
import BidHistoryList from '../../components/BidHistoryList/BidHistoryList'; // Ensure correct path
import WinHistoryList from '../../components/WinHistoryList/WinHistoryList'; // Ensure correct path

const History = () => {
    const { user } = useContext(AuthContext);
    const [initialLoad, setInitialLoad] = useState(true);
    const [bidHistory, setBidHistory] = useState([]);
    const [winHistory, setWinHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserHistory = async (userId) => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/user/${userId}/history`);
                console.log(response.data);
                setBidHistory(response.data.bidHistory);
                setWinHistory(response.data.winHistory);
                setInitialLoad(false);
            } catch (error) {
                console.error('Error fetching user history:', error);
            }
        };

        if (initialLoad && user && user._id) {
            fetchUserHistory(user._id);
        }
    }, [user, initialLoad]);

    return (
        <div>
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            <div className="history-container">
            <h2>Historique des Gains</h2>
                {winHistory.length > 0 ? (
                    <WinHistoryList winHistory={winHistory} />
                ) : (
                    <p>Aucun gain trouvé.</p>
                )}
                <h2>Historique des Enchères</h2>
                {bidHistory.length > 0 ? (
                    <BidHistoryList bidHistory={bidHistory} />
                ) : (
                    <p>Aucune offre trouvée.</p>
                )}
            </div>
        </div>
    );
};

export default History;
