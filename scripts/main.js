
import React from 'react';
import ReactDOM from 'react-dom';


// var ReactRouter = require('react-router');
import { Router, Route } from 'react-router'
// var Navigation =ReactRouter.Navigation;

// Mixin
var createBrowserHistory = require('history/lib/createBrowserHistory')

// Import modules

import NotFound from './components/NotFound';
import StorePicker from './components/StorePicker';
import App from './components/App';
/* 
  Routes
*/

var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound}/>
  </Router>
)



ReactDOM.render(routes, document.querySelector('#main'));