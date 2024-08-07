// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import ResetPassword from './pages/ResetPassword/ResetPassword'
import NewPassword from './pages/NewPassword/NewPassword';
import Home from './pages/Home/Home';
import Partners from './pages/Partners/Partners';
import BecomePartner from './pages/BecomePartner/BecomePartner';
import ViewPartner from './pages/ViewPartner/ViewPartner';
import NotFound from './pages/NotFound/NotFound';
import Register from './pages/Register/Register';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ViewProduct from './pages/ViewProduct/ViewProduct';
import PostProductForm from './pages/PostProduct/PostProduct';
import Settings from './pages/Settings/Settings';
import Wallet from './pages/Wallet/Wallet';
import Refund from './pages/Refund/Refund'
import Success from './pages/Success/Success';
import Cancel from './pages/Cancel/Cancel';
import History from './pages/History/History'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import RefundRequestsManager from './pages/RefundRequestsManager/RefundRequestsManager';
import UserManager from './pages/UserManager/UserManager';
import ViewUserAdmin from './pages/ViewUserAdmin/ViewUserAdmin';
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
              <Route path="/becomepartner" element= {<BecomePartner/>} />
              <Route path="/viewpartner/:partnerId" element={<ViewPartner/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/resetpassword" element={<ResetPassword />} />
              <Route path="/newpassword/:token" element={<NewPassword />} />
              <Route path="/wallet" element={<Wallet/>} />
              <Route path="/refund" element={<Refund/>} />
              <Route path="/settings" element = {<Settings />} />
              <Route path= "/viewproduct/:productId" element={<ViewProduct/>} />
              <Route path="/register" element = {<Register />} />
              <Route path='/admindashboard' element = {<AdminRoute><AdminDashboard/></AdminRoute>} />
              <Route path="/success" element = {<Success />} />
              <Route path="/cancel" element = {<Cancel />} />
              <Route path="/history" element = {<History />} />
              <Route path='/admindashboard' element = {<AdminRoute><AdminDashboard/></AdminRoute>} />
              <Route path="/admin/postproduct" element = {<AdminRoute><PostProductForm /></AdminRoute>} />
              <Route path="/admin/refundrequests" element = {<AdminRoute><RefundRequestsManager /></AdminRoute>} />
              <Route path="/admin/users" element = {<AdminRoute><UserManager /></AdminRoute>} />
              <Route path="/admin/users/:userId" element = {<AdminRoute><ViewUserAdmin /></AdminRoute>} />
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
