import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import App from './components/App';

import SignUp from './components/SignUp';
import Login from './components/Login';
import CreateDepartment from './components/CreateDepartment';
import GenerateReport from './components/GenerateReport';
import './index.css';

render(
  <Router history={history}>
    <Switch>
      <Route exact path='/' component={App} />
      <Route path='/login' component={Login} />
      <Route path='/signUp' component={SignUp} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
