import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import Auth from './hoc/auth' //HOC로 모든 컴포넌트를 감싸줘야 작동함.

function App() {
  return (
    <>
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, true)} />
        </Switch>
      </div>
    </Router>
    </>
  );
}

export default App;
