import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PartnerList.css';

const PartnerList = ({ partners }) => {
  const navigate = useNavigate();

  const handlePartnerClick = (partner) => {
    navigate(`/viewpartner/${partner._id}`);
  };

  return (
    <div className='partner-list'>
      {partners.map(partner => (
        <div 
          key={partner._id} 
          className='partner-item'
          onClick={() => handlePartnerClick(partner)}
        >
          <h2>{partner.username}</h2>
        </div>
      ))}
    </div>
  );
};

export default PartnerList;
