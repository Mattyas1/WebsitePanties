import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../constants";
import axios from "axios";
import "./Partners.css";
import PartnerList from "../../components/PartnerList/PartnerList";
import { useTranslation } from 'react-i18next';


const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/partner`);
        setPartners(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingPartners(false);
      }
    };

    fetchPartners();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="partner-container">
      <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
      <h1>{t('ourPartners')}</h1>
      {loadingPartners ? (
        <p>{t('loading')}</p>
      ) : error ? (
        <p>{t('error')}: {error}</p>
      ) : (
        <PartnerList partners={partners} />
      )}
    </div>
  );
};

export default Partners;
