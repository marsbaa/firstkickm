var React = require('react');
var ReactDOM = require('react-dom');
var {Route, Router, IndexRoute, hashHistory} = require('react-router');
import NavBar from 'NavBar';
import CentresProfile from 'CentresProfile';

ReactDOM.render(
  <div>
      <NavBar />
      <CentresProfile />
  </div>

  ,
  document.getElementById('app')
);
