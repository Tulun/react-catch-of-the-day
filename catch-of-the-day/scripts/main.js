
var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation =ReactRouter.Navigation;


// Mixin
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory')

var h = require('./helpers');

var App = React.createClass({

  render : function() {
    return (
      <div className = "catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
        </div>
        <Order/>
        <Inventory/>
      </div>
    )
  }
});

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
  }
});

var Order = React.createClass({
  render : function() {
    return (
      <p>Order</p>
    )
  }
});

var Inventory = React.createClass({
  render : function() {
    return (
      <p>Inventory</p>
    )
  }
});

var StorePicker = React.createClass({

  mixins : [History],

  goToStore : function(event) {
    event.preventDefault();
    // getting data from input
    var storeId = this.refs.storeId.value;
    this.history.pushState(null, '/store/' + storeId)
    },
  render : function() {
    // JS comments here
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        {/* Creating the store */}
        <h2> Please Enter A Store </h2>
        <input type ="text" ref="storeId" defaultValue={h.getFunName()} required />
        <input type="Submit" />
      </form>
    )
  }
});

// Not found

var NotFound = React.createClass({
  render : function() {
    return (
      <h1> Not Found! </h1>
    )
  }
})

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