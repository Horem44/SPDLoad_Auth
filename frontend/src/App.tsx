import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Profile from './pages/Profile/Profile';
import SigninPage from './pages/SigninPage/SigninPage';
import SignupPage from './pages/SignupPage/SignupPage'
import { authActions } from './store/auth-slice';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if(localStorage.getItem('token')){
      dispatch(authActions.login());
    }
  }, [dispatch])

  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path='/' element={<SignupPage/>} />
        <Route path='/sign-up' element={<SignupPage/>} />
        <Route path='/sign-in' element={<SigninPage/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/*' element={<SignupPage/>} />
      </Routes>
    </div>
  );
}

export default App;
