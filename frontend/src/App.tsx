import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Profile from './pages/Profile/Profile';
import SigninPage from './pages/SigninPage/SigninPage';
import SignupPage from './pages/SignupPage/SignupPage'

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path='/sign-up' element={<SignupPage/>} />
        <Route path='/sign-in' element={<SigninPage/>} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
    </div>
  );
}

export default App;
