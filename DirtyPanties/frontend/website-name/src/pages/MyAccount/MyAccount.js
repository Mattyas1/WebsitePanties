import React, { useContext } from 'react';
import "./MyAccount.css"
import Cookies from 'js-cookie';
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from 'react-router-dom';


const MyAccount = () => {

const {setUser, setIsAuthenticated} = useContext(AuthContext);
const navigate = useNavigate();

const handleLogout = () => {

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    setUser(null);
    setIsAuthenticated(false);

    navigate("/login");
    }

const handleGoToSettings= () => {
    navigate("/settings")
}

  return (
    <div className="my-account-container">
      <div className="my-account-content">
        <h1>Welcome to your Account</h1>
        <button className='logout-button' onClick= {handleLogout}>
            Logout
        </button>
        <button className='settings-button' onClick={handleGoToSettings}>
          Go to Settings
        </button>
      </div>
    </div>
  )
};

export default MyAccount;