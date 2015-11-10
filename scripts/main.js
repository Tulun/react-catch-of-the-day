
import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route } from 'react-router'

// Mixin
// var createBrowserHistory = require('history/lib/createBrowserHistory')
import { createHistory } from 'history'
// Import modules

import NotFound from './components/NotFound';
import StorePicker from './components/StorePicker';
import App from './components/App';
/* 
  Routes
*/

var routes = (
  <Router history={createHistory()}>
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound}/>
  </Router>
)



ReactDOM.render(routes, document.querySelector('#main'));