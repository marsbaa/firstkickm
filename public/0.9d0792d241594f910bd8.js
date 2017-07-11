webpackJsonp([0],{

/***/ 1605:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  border-radius: 3px;\n  border: 1px solid ', ';\n  background : none;\n  color: ', ';\n'], ['\n  border-radius: 3px;\n  border: 1px solid ', ';\n  background : none;\n  color: ', ';\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  color: ', ';\n  margin-top: 20px;\n'], ['\n  color: ', ';\n  margin-top: 20px;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  text-decoration: none;\n  color: ', ';\n  border-bottom: 1px dashed;\n  padding-top: 5px;\n  fontWeight: 500;\n  margin-left: 20px;\n'], ['\n  text-decoration: none;\n  color: ', ';\n  border-bottom: 1px dashed;\n  padding-top: 5px;\n  fontWeight: 500;\n  margin-left: 20px;\n']);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = __webpack_require__(8);

var _reactRedux = __webpack_require__(3);

var _helper = __webpack_require__(30);

var _actions = __webpack_require__(10);

var _reactRouter = __webpack_require__(13);

var _styledComponents = __webpack_require__(337);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _Loading = __webpack_require__(340);

var _Loading2 = _interopRequireDefault(_Loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Button = _styledComponents2.default.button(_templateObject, function (props) {
  return props.theme.primary;
}, function (props) {
  return props.theme.primary;
});

var StyledLink = (0, _styledComponents2.default)(_reactRouter.Link)(_templateObject2, function (props) {
  return props.theme.secondary;
});

var StyledHeaderLink = (0, _styledComponents2.default)(_reactRouter.Link)(_templateObject3, function (props) {
  return props.theme.primary;
});

var NavBar = function (_React$Component) {
  _inherits(NavBar, _React$Component);

  function NavBar() {
    _classCallCheck(this, NavBar);

    return _possibleConstructorReturn(this, (NavBar.__proto__ || Object.getPrototypeOf(NavBar)).apply(this, arguments));
  }

  _createClass(NavBar, [{
    key: 'onLogout',
    value: function onLogout() {
      var dispatch = this.props.dispatch;

      dispatch((0, _actions.startLogout)());
      _reactRouter.browserHistory.push('/');
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var dispatch = this.props.dispatch;

      dispatch((0, _actions.startUsers)());
      dispatch((0, _actions.startCentres)());
      dispatch((0, _actions.startCalendars)());
      dispatch((0, _actions.startStudents)());
      dispatch((0, _actions.startAgeGroup)());
      dispatch((0, _actions.startMakeUps)());
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          navbar = _props.navbar,
          auth = _props.auth,
          users = _props.users,
          isFetching = _props.isFetching;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _reactBootstrap.Navbar,
          { style: { padding: '10px', marginBottom: '0px' } },
          _react2.default.createElement(
            _reactBootstrap.Navbar.Header,
            null,
            _react2.default.createElement(
              _reactBootstrap.Navbar.Brand,
              { style: { fontSize: '16px' } },
              _react2.default.createElement(
                StyledLink,
                { to: '/m' },
                _react2.default.createElement(_reactBootstrap.Image, { src: '/images/logo.png', height: '40px', rounded: true })
              ),
              _react2.default.createElement(
                StyledHeaderLink,
                { to: navbar.link },
                navbar.title
              )
            ),
            _react2.default.createElement(_reactBootstrap.Navbar.Toggle, { style: { marginTop: '15px' } })
          ),
          _react2.default.createElement(
            _reactBootstrap.Navbar.Collapse,
            null,
            (0, _helper.isManager)(auth, users) ? _react2.default.createElement(
              _reactBootstrap.Nav,
              { style: { float: 'right' } },
              _react2.default.createElement(
                _reactBootstrap.NavItem,
                { key: 'centres', eventKey: 1 },
                _react2.default.createElement(
                  'butt',
                  {
                    onClick: function onClick(e) {
                      e.preventDefault();
                      _reactRouter.browserHistory.push('/m/centres');
                    }
                  },
                  'Centres Profile'
                )
              ),
              _react2.default.createElement(
                _reactBootstrap.NavItem,
                { key: 'settings', eventKey: 2 },
                _react2.default.createElement(
                  'butt',
                  {
                    onClick: function onClick(e) {
                      e.preventDefault();
                      _reactRouter.browserHistory.push('/m/settings');
                    }
                  },
                  'Settings'
                )
              ),
              _react2.default.createElement(
                _reactBootstrap.NavItem,
                { key: 'users', eventKey: 3 },
                _react2.default.createElement(
                  'butt',
                  {
                    onClick: function onClick(e) {
                      e.preventDefault();
                      _reactRouter.browserHistory.push('/m/users');
                    }
                  },
                  'Access Rights'
                )
              ),
              _react2.default.createElement(
                _reactBootstrap.NavItem,
                { eventKey: 4 },
                _react2.default.createElement(
                  Button,
                  { onClick: this.onLogout.bind(this) },
                  'Log Out'
                )
              )
            ) : _react2.default.createElement(
              _reactBootstrap.Nav,
              { style: { float: 'right' } },
              _react2.default.createElement(
                _reactBootstrap.NavItem,
                { eventKey: 1 },
                _react2.default.createElement(
                  Button,
                  { onClick: this.onLogout.bind(this) },
                  'Log Out'
                )
              )
            )
          )
        ),
        isFetching.completed ? _react2.default.createElement(
          'div',
          { style: { padding: '0px 8px' } },
          this.props.children
        ) : _react2.default.createElement(_Loading2.default, null)
      );
    }
  }]);

  return NavBar;
}(_react2.default.Component);

function mapStateToProps(state) {
  return {
    navbar: state.navbar,
    auth: state.auth,
    users: state.users,
    isFetching: state.isFetching
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps)(NavBar);

/***/ })

});