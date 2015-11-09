
var React = require('react');
var ReactDOM = require('react-dom');


var App = React.createClass({

  render : function() {
    return (
      <div className = "catch-of-the-day">
        <div className="menu">
          <Header />
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
      <p>Header</p>
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
  render : function() {
    var name = "Jason"
    // JS comments here
    return (
      <form className="store-selector">
        {/* Creating the store */}
        <h2> Please Enter A Store {name} </h2>
        <input type ="text" ref="storeId" required />
        <input type="Submit" />
      </form>
    )
  }
});


ReactDOM.render(<App/>, document.querySelector('#main'));