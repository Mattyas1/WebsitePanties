import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './BecomePartner.css';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import { useTranslation } from 'react-i18next';

const BecomePartner = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    post: '',
    images: [],
  });

  const [partnerApplication, setPartnerApplication] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchPartnerApplication = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/partner/application`);
        if (response.status === 200) {
          setPartnerApplication(response.data);
        }
      } catch (error) {
        console.error('Error fetching partner application:', error);
      }
    };

    if (isAuthenticated) {
      fetchPartnerApplication();
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({ ...prevData, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('post', formData.post);
    formData.images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    try {
      let response;
      if (editMode) {
        response = await axios.put(`${API_BASE_URL}/api/partner/application/`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post(`${API_BASE_URL}/api/partner/application`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response.status === 201 || response.status === 200) {
        alert('Your application has been submitted successfully!');
        setPartnerApplication(response.data);
        setEditMode(false);
      } else {
        alert('There was an error submitting your application.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting your application.');
    }
  };

  const handleEditClick = () => {
    setFormData({
      phoneNumber: partnerApplication.phoneNumber,
      email: partnerApplication.email,
      post: partnerApplication.post,
      images: [],
    });
    setEditMode(true);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/partner/application`);
      setPartnerApplication(null);
      setEditMode(false);
      setDeleteModalOpen(false);
      alert('Application deleted successfully.');
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Error deleting application.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  return (
    <div className="become-partner-container">
      <h1>{t('becomePartner')}</h1>
      {!partnerApplication && (
        <p className="intro-text">
          {t('partnerApplicationIntro')}
        </p>
      )}
      {isAuthenticated ? (
        partnerApplication ? (
          editMode ? (
            <form onSubmit={handleSubmit} className="become-partner-form">
              <div className="form-group">
                <label htmlFor="phoneNumber">{t('phoneNumber')}:</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">{t('email')}:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="post">{t('writePost')}:</label>
                <textarea
                  id="post"
                  name="post"
                  value={formData.post}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="images">{t('uploadImages')}:</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  onChange={handleImageChange}
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-button">{t('submit')}</button>
                <button type="button" className="cancel-button" onClick={() => setEditMode(false)}>{t('cancel')}</button>
              </div>
            </form>
          ) : (
            <div className="application-details">
              <h2 className="details-title">{t('yourApplication')}</h2>
              <div className="details-info">
                <div className="info-item">
                  <strong>{t('status')}:</strong>
                  <span className={`status ${partnerApplication.status}`}>{partnerApplication.status}</span>
                </div>
                <div className="info-item">
                  <strong>{t('submittedOn')}:</strong>
                  <span>{new Date(partnerApplication.submissionDate).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <strong>{t('phoneNumber')}:</strong>
                  <span>{partnerApplication.phoneNumber}</span>
                </div>
                <div className="info-item">
                  <strong>{t('email')}:</strong>
                  <span>{partnerApplication.email}</span>
                </div>
                <div className="info-item">
                  <strong>{t('post')}:</strong>
                  <span>{partnerApplication.post}</span>
                </div>
              </div>
              <div className="images-container">
                <h3 className="images-title">{t('images')}</h3>
                {partnerApplication.images.length > 0 ? (
                  <div className="images-grid">
                    {partnerApplication.images.map((image, index) => (
                      <img
                        key={index}
                        src={`${API_BASE_URL}/${image}`}
                        alt={t('uploadedOn') + new Date(partnerApplication.submissionDate).toLocaleDateString()}
                        className="application-image"
                      />
                    ))}
                  </div>
                ) : (
                  <p>{t('noImagesUploaded')}</p>
                )}
              </div>
              <div className="action-buttons">
                <button className="edit-button" onClick={handleEditClick}>{t('editApplication')}</button>
                <button className="delete-button" onClick={handleDeleteClick}>{t('deleteApplication')}</button>
              </div>
            </div>
          )
        ) : (
          <form onSubmit={handleSubmit} className="become-partner-form">
            <div className="form-group">
              <label htmlFor="phoneNumber">{t('phoneNumber')}:</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('email')}:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="post">{t('writePost')}:</label>
              <textarea
                id="post"
                name="post"
                value={formData.post}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="images">{t('uploadImages')}:</label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                onChange={handleImageChange}
              />
            </div>

            <button type="submit" className="submit-button">{t('submit')}</button>
          </form>
        )
      ) : (
        <div className="login-prompt">
          <p>{t('loginPrompt')}</p>
          <button onClick={() => navigate('/login')} className="login-button">{t('logIn')}</button>
        </div>
      )}
      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{t('confirmDeletion')}</h3>
            <p>{t('deleteConfirmationMessage')}</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleDeleteConfirm}>{t('yesDelete')}</button>
              <button className="cancel-button" onClick={handleDeleteCancel}>{t('cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default BecomePartner;
