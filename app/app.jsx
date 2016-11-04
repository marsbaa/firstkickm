var React = require('react');
var ReactDOM = require('react-dom');
var {Route, Router, IndexRoute, hashHistory} = require('react-router');
import NavBar from 'NavBar';

ReactDOM.render(
  <div>
      <NavBar />
  </div>

  ,
  document.getElementById('app')
);
