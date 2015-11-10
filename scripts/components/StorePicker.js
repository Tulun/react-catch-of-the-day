import React from 'react';
import { History } from 'react-router';
import h from '../helpers';

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

export default StorePicker;