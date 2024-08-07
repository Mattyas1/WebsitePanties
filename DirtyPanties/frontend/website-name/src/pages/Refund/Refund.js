// components/Refund.js
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../constants';
import Modal from 'react-modal';
import RefundRequestList from '../../components/RefundRequestList/RefundRequestList';
import './Refund.css';

Modal.setAppElement('#root'); // Make sure to bind modal to your appElement

const Refund = () => {
  const { user, setUser } = useContext(AuthContext);
  const [refundAmount, setRefundAmount] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountHolderAddress, setAccountHolderAddress] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAddress, setBankAddress] = useState('');
  const [amountError, setAmountError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/wallet/refund`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.status === 200) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching refund requests:', error);
    }
  };

  useEffect(() => {

    fetchRequests();
  }, []);

  const handleRefundAmountChange = (e) => {
    const amount = parseFloat(e.target.value);
    if (amount > user.wallet.amount) {
      setAmountError('Refund amount exceeds wallet balance');
    } else {
      setAmountError('');
      setRefundAmount(e.target.value);
    }
  };

  const handleIbanChange = (e) => {
    setIban(e.target.value);
  };

  const handleBicChange = (e) => {
    setBic(e.target.value);
  };

  const handleAccountHolderNameChange = (e) => {
    setAccountHolderName(e.target.value);
  };

  const handleAccountHolderAddressChange = (e) => {
    setAccountHolderAddress(e.target.value);
  };

  const handleBankNameChange = (e) => {
    setBankName(e.target.value);
  };

  const handleBankAddressChange = (e) => {
    setBankAddress(e.target.value);
  };

  const openModal = () => {
    if (!refundAmount || refundAmount <= 0 || amountError) {
      console.error('Please enter a valid refund amount');
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRefundSubmit = async () => {
    const amount = parseFloat(refundAmount);

    if (amount > user.wallet.amount) {
      setAmountError('Refund amount exceeds wallet balance');
      return;
    }

    if (amount > 0 && iban && bic && accountHolderName && accountHolderAddress && bankName && bankAddress) {
      try {
        const body = {
          userId: user._id, 
          amount,
          iban,
          bic,
          accountHolderName,
          accountHolderAddress,
          bankName,
          bankAddress,
        };
        const headers = {
          'Content-Type': 'application/json',
        };

        const response = await axios.post(`${API_BASE_URL}/api/wallet/refund`, body, { headers });
        if (response.data.message) {
          setUser((prevUser) => ({
            ...prevUser,
            wallet: response.data.updatedWallet
          }));
          await fetchRequests();
          console.log(response.data.message);
        } else {
          console.error(response.data.error);
        }
      } catch (error) {
        console.error('Error processing refund:', error);
      } finally {
        closeModal();
      }
    } else {
      console.error('All fields are required or insufficient funds');
    }
  };

  return (
    <div className="refund-container">
      <h1>Request a Refund</h1>
      <p>Enter the amount you want to refund and provide your bank details.</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="input-group">
          <input
            type="number"
            min="1"
            step="0.01"
            value={refundAmount}
            onChange={handleRefundAmountChange}
            placeholder="Enter refund amount"
          />
          {amountError && <p className="error-message">{amountError}</p>}
        </div>
        <input
          type="text"
          value={iban}
          onChange={handleIbanChange}
          placeholder="Enter your IBAN"
        />
        <input
          type="text"
          value={bic}
          onChange={handleBicChange}
          placeholder="Enter your BIC/SWIFT"
        />
        <input
          type="text"
          value={accountHolderName}
          onChange={handleAccountHolderNameChange}
          placeholder="Enter account holder's name"
        />
        <input
          type="text"
          value={accountHolderAddress}
          onChange={handleAccountHolderAddressChange}
          placeholder="Enter account holder's address"
        />
        <input
          type="text"
          value={bankName}
          onChange={handleBankNameChange}
          placeholder="Enter bank name"
        />
        <input
          type="text"
          value={bankAddress}
          onChange={handleBankAddressChange}
          placeholder="Enter bank address"
        />
        <button type="button" onClick={openModal}>Request Refund</button>
      </form>

      <RefundRequestList requests={requests} />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Refund Request"
        className="refund-modal"
        overlayClassName="refund-modal-overlay"
      >
        <h2>Confirm Refund Request</h2>
        <p>Refund Amount: ${refundAmount}</p>
        <p>IBAN: {iban}</p>
        <p>BIC/SWIFT: {bic}</p>
        <p>Account Holder's Name: {accountHolderName}</p>
        <p>Account Holder's Address: {accountHolderAddress}</p>
        <p>Bank Name: {bankName}</p>
        <p>Bank Address: {bankAddress}</p>
        <p>Note: Refunds can take up to 2 weeks to be processed. Please make sure the above information is correct. Lust Auction will not be held responsible if not.</p>
        <div className="modal-actions">
          <button onClick={handleRefundSubmit}>Confirm</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default Refund;
