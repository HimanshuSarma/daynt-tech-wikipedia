import React, {useState, useEffect} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';

import Header from './Components/Header';
import SearchPage from './Pages/SearchPage';
import SearchResult from './Pages/SearchResult';
import WikipediaPage from './Pages/WikipediaPage';
import Analytics from './Pages/Analytics';
import Login from './Pages/Login';

import base_url from './appSetup';

import './App.css';

function App() {

  const [searchResults, setSearchResults] = useState(null);
  const [wikipediaHTMLPage, setWikipediaHTMLPage] = useState(null);
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const [loginIntervalID, setLoginIntervalID] = useState(null);

  const navigate = useNavigate();

  const loginSetIntervalHandler = async (expiry) => {
    clearInterval(loginIntervalID);
    const intervalID = setInterval(() => {
      const loginReqHandler = async () => {
        const loginReq = await fetch(`${base_url}/admin-user/refresh-token`, {
          method: 'GET',
          credentials: 'include'
        });
      }
      
      loginReqHandler();
    }, (expiry - 60000));

    setLoginIntervalID(intervalID);
  }

  useEffect(() => {
    if(wikipediaHTMLPage) {
      navigate('/wikipedia');
    }
  }, [wikipediaHTMLPage]);

  useEffect(() => {
    const checkLogin = async () => {
      const checkLoginReq = await fetch(`${base_url}/admin-user/check-login`, {
        method: 'GET',
        credentials: 'include'
      });

      const checkLoginReqData = await checkLoginReq.json();

      if(checkLoginReq.ok) {
        setIsLoggedInState(true);
        loginSetIntervalHandler(checkLoginReqData.expiresIn);
      } else {
        setIsLoggedInState(false);
      }
    }

    checkLogin();
  }, []);

  return (
    <div className="App">
      <Header isLoggedInState={isLoggedInState} loginIntervalID={loginIntervalID} 
        setSearchResults={setSearchResults} setWikipediaHTMLPage={setWikipediaHTMLPage} 
        setIsLoggedInState={setIsLoggedInState}/>
      <SearchPage setSearchResults={setSearchResults} />
      <Routes>
        <Route path='/' element={<div>
          {searchResults && searchResults.map((searchResult, index) => {
            return (
              <React.Fragment key={index}>
                <SearchResult searchResult={searchResult} setWikipediaHTMLPage={setWikipediaHTMLPage} />
              </React.Fragment>
            )
          })}
          </div>}>
        </Route>

        <Route path='/wikipedia' element={<WikipediaPage wikipediaHTMLPage={wikipediaHTMLPage} />}></Route>
        <Route path='/analytics' element={<Analytics isLoggedInState={isLoggedInState} />}></Route>
        <Route path='/login' element={<Login setIsLoggedInState={setIsLoggedInState} 
          loginSetIntervalHandler={loginSetIntervalHandler} />}></Route>
      </Routes>
    </div>
  );
}

export default App;
