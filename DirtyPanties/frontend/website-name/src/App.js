// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import ResetPassword from './pages/ResetPassword/ResetPassword'
import NewPassword from './pages/NewPassword/NewPassword';
import Home from './pages/Home/Home';
import Partners from './pages/Partners/Partners';
import ViewPartner from './pages/ViewPartner/ViewPartner';
import NotFound from './pages/NotFound/NotFound';
import Register from './pages/Register/Register';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ViewProduct from './pages/ViewProduct/ViewProduct';
import PostProductForm from './pages/PostProduct/PostProduct';
import Settings from './pages/Settings/Settings';
import RechargeWallet from './pages/RechargeWallet/RechargeWallet';
import Success from './pages/Success/Success';
import Cancel from './pages/Cancel/Cancel';
import History from './pages/History/History'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import axios from 'axios';
import AdminRoute from './components/AdminRoute';
import {WebSocketProvider} from './context/WebSocketContext';

const App = () => {
  axios.defaults.withCredentials = true;

  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/partners" element= {<Partners/>} />
              <Route path="/viewpartner/:partnerId" element={<ViewPartner/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/resetpassword" element={<ResetPassword />} />
              <Route path="/newpassword/:token" element={<NewPassword />} />
              <Route path="/rechargewallet" element={<RechargeWallet/>} />
              <Route path="/settings" element = {<Settings />} />
              <Route path= "/viewproduct/:productId" element={<ViewProduct/>} />
              <Route path="/register" element = {<Register />} />
              <Route path='/admindashboard' element = {<AdminRoute><AdminDashboard/></AdminRoute>} />
              <Route path="/success" element = {<Success />} />
              <Route path="/cancel" element = {<Cancel />} />
              <Route path="/history" element = {<History />} />
              <Route path="/postproduct" element = {<AdminRoute><PostProductForm /></AdminRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
};

export default App;
