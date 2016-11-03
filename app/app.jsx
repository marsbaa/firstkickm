var React = require('react');
var ReactDOM = require('react-dom');
var {Route, Router, IndexRoute, hashHistory} = require('react-router');
import NavBar from 'NavBar';
import Showcase from 'Showcase';
import Quote from 'Quote';
import Features from 'Features';
import Contact from 'Contact';
import Footer from 'Footer';

ReactDOM.render(
  <div>
      <NavBar />
      <Showcase />
      <Quote />
      <Features />
      <Contact />
      <Footer />
  </div>

  ,
  document.getElementById('app')
);
