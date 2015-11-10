import React from 'react';

var CSSTransitionGroup = require('react-addons-css-transition-group')


var h = require('../helpers');

// this is used to sync our state with Firebase
var Rebase = require('re-base');

// Firebase URL added here
var base = Rebase.createClass('https://jkaycatch-of-the-day.firebaseio.com/')

/* Use react catalyst in order to get into nested state.
Unfortunately, React's built into data only gets top level,
ie for this app: fishes, but not fish1, fish2. We want it to track
Fish 1 / fish 2. React catalyst is a mixin that goes deeper
*/

var Catalyst = require('react-catalyst');
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

// Fish component

var Fish = React.createClass({
  // Name of the onButtonClick is arbitrary.
  onButtonClick : function () {
    // console.log("Going to add the fish.", this.props.index)
    var key = this.props.index
    this.props.addToOrder(key)
  },

  render : function () {
    var details = this.props.details;
    var isAvailable = (details.status === 'available' ? true : false);
    var buttonText = (isAvailable ? 'Add to Order' : 'Sold Out!')
    return (
      <li className = "menu-fish">
        <img src={details.image} alt={details.name} />
        <h3 className="fish-name">
          {details.name}
          <span className="price"> {h.formatPrice(details.price)} </span>
        </h3>
        <p>{details.desc} </p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText} </button>
      </li>
    )
  }
})

/*
  Add Fish Form
*/

var AddFishForm = React.createClass({
  createFish : function(event) {
    // Stop the form from submitting
    event.preventDefault();
    // Take the data from the fish and create an object
    var fish = {
      name : this.refs.name.value,
      price : this.refs.price.value,
      status : this.refs.status.value,
      desc : this.refs.desc.value,
      image : this.refs.image.value
    }

    // Add the fish to the app state
    this.props.addFish(fish);
    this.refs.fishform.reset();
  },
  render : function () {
    return (
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price" />
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to Image" />
        <button type="submit">+ Add Item </button>
      </form>
    )
  } 
})

/*
  Header
*/

var Header = React.createClass({
  render : function() {
    return (
      <header className = "top">
        <h1> Catch
          <span className = "ofThe">
            <span className="of">of</span>
            <span className="the">the</span>
          </span>
          Day</h1>
        <h3 className="tagline"><span>{this.props.tagline}</span></h3>
      </header>
    )
  },

  propTypes : {
    tagline : React.PropTypes.string.isRequired
  }
});

var Order = React.createClass({
  renderOrder : function(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];
    var removeButton = <button onClick={this.props.removeFromOrder.bind(null, key)}>&times;</button>

    if(!fish) {
      return <li key={key}> Sorry, fish no longer available. {removeButton}</li>
    }

    return (
      <li key={key}>
        <span>
        <CSSTransitionGroup className="count" component="span" transitionName="count"
         transitionLeaveTimeout={250} transitionEnterTimeout={250}>
          <span key={count}>{count}</span>
        </CSSTransitionGroup>

         lbs {fish.name} {removeButton}
        </span>
        <span className="price">{h.formatPrice(count * fish.price)}</span>
      </li>
    )
  },

  render : function() {
    var orderIds = Object.keys(this.props.order);
    var total = orderIds.reduce((prevTotal, key)=> {
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = fish && fish.status === 'available';

      if(fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      }

      return prevTotal;
    }, 0);

    return (
      <div className="order-wrap">
        <h2 className="order-title"> Your Order </h2>
        <CSSTransitionGroup className="order" component="ul" transitionName="order"
         transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {h.formatPrice(total)}
          </li>
        </CSSTransitionGroup>
      </div>
    )
  },

  propTypes : {
    fishes : React.PropTypes.object.isRequired,
    order : React.PropTypes.object.isRequired,
    removeFromOrder : React.PropTypes.func.isRequired
  }
});

var Inventory = React.createClass({

  renderInventory : function (key) {
    var linkState = this.props.linkState
    return (
      <div className="fish-edit" key={key}>
        <input type="text" valueLink={linkState('fishes.'+ key + '.name')} />
        <input type="text" valueLink={linkState('fishes.'+ key + '.price')} />
        <select valueLink ={linkState('fishes.' + key + '.status')}>
          <option value ="unavailable"> Sold out! </option>
          <option value ="unavailable"> Fresh! </option>
        </select>

        <textarea valueLink={linkState('fishes.' + key + '.desc')}></textarea>
        <input type="text" valueLink={linkState('fishes.'+ key +'.image')}/>
        <button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>

      </div>
    )
  },

  render : function() {
    return (
      <div>
        <h2> Inventory </h2>
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}> Load Sample Fish</button>
      </div>
    )
  },

  propTypes : {
    addFish : React.PropTypes.func.isRequired,
    loadSamples : React.PropTypes.func.isRequired,
    fishes : React.PropTypes.object.isRequired,
    linkState : React.PropTypes.func.isRequired,
    removeFish : React.PropTypes.func.isRequired
  }
});

export default App;