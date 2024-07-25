// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import ResetPassword from './pages/ResetPassword/ResetPassword'
import NewPassword from './pages/NewPassword/NewPassword';
import Marketplace from './pages/Marketplace/Marketplace';
import NotFound from './pages/NotFound/NotFound';
import Register from './pages/Register/Register';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ViewProduct from './pages/ViewProduct/ViewProduct';
import PostProductForm from './pages/PostProduct/PostProduct';
import Settings from './pages/Settings/Settings';
import BuyCoins from './pages/BuyCoins/BuyCoins';
import Success from './pages/Success/Success';
import Cancel from './pages/Cancel/Cancel';
import {AuthProvider } from './context/AuthContext';
import axios from 'axios';


const App = () => {
  axios.defaults.withCredentials = true;


  return (
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/newpassword" element={<NewPassword />} />
            <Route path="/buycoins" element={<BuyCoins/>} />
            <Route path="/settings" element = {<Settings />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path= "/viewproduct/:id" element={<ViewProduct/>} />
            <Route path="/register" element = {<Register />} />
            <Route path="/success" element = {<Success />} />
            <Route path="/cancel" element = {<Cancel />} />
            <Route path="/postproduct" element = {<PostProductForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
