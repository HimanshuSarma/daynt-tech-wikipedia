import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import base_url from '../appSetup';

const Login = ({setIsLoggedInState, loginSetIntervalHandler}) => {
  
  const [loginFormState, setLoginFormState] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const loginFormSubmitHandler = async (e) => {
    e.preventDefault();
    if(loginFormState.username !== '' && loginFormState.password !== '') {
        const loginReq = await fetch(`${base_url}/admin-user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(loginFormState)
        });

        const loginReqData = await loginReq.json();

        if(loginReq.ok) {
            setIsLoggedInState(true);
            loginSetIntervalHandler(loginReqData.expiresIn);
            navigate('/');
        }
    }
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', width: '90%', margin: '2rem auto 0 auto'}}>
      <h3>
        Please enter the credentials to login:
      </h3>

      <form onSubmit={e => loginFormSubmitHandler(e)} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
        <input onChange={e => {
            setLoginFormState(currentFormState => {
                return {...currentFormState, username: e.target.value}
            })
        }} value={loginFormState.username} style={{maxWidth: '20rem', width: '100%', padding: '0.5rem 1rem'}} type="text" placeholder='Username' />
        <input onChange={e => {
            setLoginFormState(currentFormState => {
                return {...currentFormState, password: e.target.value}
            })
        }} value={loginFormState.password} style={{maxWidth: '20rem', width: '100%', padding: '0.5rem 1rem'}} type="text" placeholder='Password' />
      
        <button>Login</button>
      </form>
    </div>
  )
}

export default Login