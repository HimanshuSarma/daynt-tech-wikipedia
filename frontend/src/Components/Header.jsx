import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

const Header = ({isLoggedInState, setIsLoggedInState, loginIntervalID, setSearchResults, setWikipediaHTMLPage}) => {

   
  const logoutHandler = async () => {
    const logoutReq = await fetch('http://localhost:5000/admin-user/logout', {
        method: 'GET',
        credentials: 'include'
    });

    if(logoutReq.ok) {
        setIsLoggedInState(false);
        clearInterval(loginIntervalID);
        setSearchResults(null);
        setWikipediaHTMLPage(null);
    }
  }  

  return (
    <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
      {isLoggedInState && 
      <Link to='/analytics'>
        Check analytics
      </Link>}

      {!isLoggedInState &&
      <Link to='/login'>
        Login
      </Link>}

      {isLoggedInState &&
        <button onClick={logoutHandler}>
          Logout
        </button>}
    </div>
  )
}

export default Header