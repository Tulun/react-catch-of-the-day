import React from 'react';

import Fish from '../components/Fish';

import Header from '../components/Header';
import Order from '../components/Order';
import Inventory from '../components/Inventory';

// this is used to sync our state with Firebase
import Rebase from 're-base';

/* Use react catalyst in order to get into nested state.
Unfortunately, React's built into data only gets top level,
ie for this app: fishes, but not fish1, fish2. We want it to track
Fish 1 / fish 2. React catalyst is a mixin that goes deeper
*/

import Catalyst from 'react-catalyst'

// Firebase URL added here
var base = Rebase.createClass('https://jkaycatch-of-the-day.firebaseio.com/')

// This variable is the main app which displays the order and inventory
var App = React.createClass({

  mixins : [Catalyst.LinkedStateMixin],
  // You need to set the initial state for the components in React
  getInitialState : function () {
    return {
      fishes : {},
      order : {}
    }
  },

  /* This function runs when the page is finished loading
  Handles local storage and syncing up with Firebase
  */
  componentDidMount : function () {
    base.syncState(this.props.params.storeId + '/fishes', {
      context : this,
      state : 'fishes'
    });

    var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);

    if (localStorageRef) {
      // update our component state to reflect what's in storage
      this.setState({
        order : JSON.parse(localStorageRef)
      })
    }
  },

  // This function allows the order to be updated
  componentWillUpdate : function(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order))
  },

  addToOrder : function (key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order : this.state.order});
  },

  removeFromOrder : function (key) {
    delete this.state.order[key];
    this.setState({
      order : this.state.order
    });
  },

  addFish : function (fish) {
    var timestamp = (new Date()).getTime();
    // update the state object
    this.state.fishes['fish-' + timestamp] = fish;
    // set the state object
    this.setState({ fishes : this.state.fishes });
  },

  removeFish : function (key) {
    if (confirm("Are you sure you want to remove this fish?")) {
      this.state.fishes[key] = null;
      this.setState({
        fishes : this.state.fishes
      })
    };
  },

  loadSamples : function() {
    this.setState({
      fishes: require('../sample-fishes')
    });
  },

  renderFish : function(key) {
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
  },

  render : function() {
    return (
      <div className = "catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder}/>
        <Inventory addFish={this.addFish} loadSamples = {this.loadSamples}
         fishes={this.state.fishes} linkState={this.linkState} removeFish={this.removeFish} />
      </div>
    )
  }
});



export default App;
