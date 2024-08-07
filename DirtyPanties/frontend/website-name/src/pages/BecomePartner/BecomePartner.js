import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './BecomePartner.css';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';

const BecomePartner = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

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
      <h1>Become a Partner</h1>
      {!partnerApplication && (
        <p className="intro-text">
          Fill out the form below to apply to become a partner. Our team will review your application and contact you if your profile matches our requirements.
        </p>
      )}
      {isAuthenticated ? (
        partnerApplication ? (
          editMode ? (
            <form onSubmit={handleSubmit} className="become-partner-form">
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number:</label>
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
                <label htmlFor="email">Email:</label>
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
                <label htmlFor="post">Write a Post:</label>
                <textarea
                  id="post"
                  name="post"
                  value={formData.post}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="images">Upload Images:</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  onChange={handleImageChange}
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-button">Submit</button>
                <button type="button" className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="application-details">
              <h2 className="details-title">Your Application</h2>
              <div className="details-info">
                <div className="info-item">
                  <strong>Status:</strong>
                  <span className={`status ${partnerApplication.status}`}>{partnerApplication.status}</span>
                </div>
                <div className="info-item">
                  <strong>Submitted on:</strong>
                  <span>{new Date(partnerApplication.submissionDate).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <strong>Phone Number:</strong>
                  <span>{partnerApplication.phoneNumber}</span>
                </div>
                <div className="info-item">
                  <strong>Email:</strong>
                  <span>{partnerApplication.email}</span>
                </div>
                <div className="info-item">
                  <strong>Post:</strong>
                  <span>{partnerApplication.post}</span>
                </div>
              </div>
              <div className="images-container">
                <h3 className="images-title">Images</h3>
                {partnerApplication.images.length > 0 ? (
                  <div className="images-grid">
                    {partnerApplication.images.map((image, index) => (
                      <img
                        key={index}
                        src={`${API_BASE_URL}/${image}`}
                        alt={`Uploaded on ${new Date(partnerApplication.submissionDate).toLocaleDateString()}`}
                        className="application-image"
                      />
                    ))}
                  </div>
                ) : (
                  <p>No images uploaded.</p>
                )}
              </div>
              <div className="action-buttons">
                <button className="edit-button" onClick={handleEditClick}>Edit Application</button>
                <button className="delete-button" onClick={handleDeleteClick}>Delete Application</button>
              </div>
            </div>
          )
        ) : (
          <form onSubmit={handleSubmit} className="become-partner-form">
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number:</label>
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
              <label htmlFor="email">Email:</label>
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
              <label htmlFor="post">Write a Post:</label>
              <textarea
                id="post"
                name="post"
                value={formData.post}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="images">Upload Images:</label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                onChange={handleImageChange}
              />
            </div>

            <button type="submit" className="submit-button">Submit</button>
          </form>
        )
      ) : (
        <div className="login-prompt">
          <p>You need to be logged in to apply to become a partner.</p>
          <button onClick={() => navigate('/login')} className="login-button">Log In</button>
        </div>
      )}
      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete your application? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleDeleteConfirm}>Yes, Delete</button>
              <button className="cancel-button" onClick={handleDeleteCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BecomePartner;
