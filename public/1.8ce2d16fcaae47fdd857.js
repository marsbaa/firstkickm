webpackJsonp([1],{

/***/ 1604:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = __webpack_require__(8);

var _reactRedux = __webpack_require__(3);

var _reactRouter = __webpack_require__(13);

var _actions = __webpack_require__(10);

var _helper = __webpack_require__(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainMenu = function (_React$Component) {
  _inherits(MainMenu, _React$Component);

  function MainMenu() {
    _classCallCheck(this, MainMenu);

    return _possibleConstructorReturn(this, (MainMenu.__proto__ || Object.getPrototypeOf(MainMenu)).apply(this, arguments));
  }

  _createClass(MainMenu, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var dispatch = this.props.dispatch;

      dispatch((0, _actions.updateNavTitle)('/m', 'Dashboard'));
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(e) {
      var _props = this.props,
          dispatch = _props.dispatch,
          centres = _props.centres;

      e.preventDefault();
      dispatch((0, _actions.updateSelectedCentre)(centres[e.target.value]));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          selection = _props2.selection,
          centres = _props2.centres,
          users = _props2.users,
          auth = _props2.auth;

      var user = _.find(users, ['email', auth.email]);

      //Centre List
      var centreOptions = [];
      centreOptions.push(_react2.default.createElement(
        'option',
        { key: '0', value: '0' },
        'select'
      ));
      if (user !== undefined) {
        Object.keys(centres).map(function (centreKey) {
          var centre = centres[centreKey];
          var index = _.findIndex(user.assignedCentres, function (c) {
            return c === centreKey;
          });
          if (index !== -1 || user.assignedCentres[0] === 'all') {
            centreOptions.push(_react2.default.createElement(
              'option',
              { key: centreKey, value: centreKey },
              _.upperFirst(centre.name)
            ));
          }
        });
        var menuHTML = [];
        if (user.assignedRoles === 'Administrator') {
          menuHTML.push(_react2.default.createElement(
            'div',
            { key: 'adminmenu' },
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/trials' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'trials',
                  disabled: selection.id === '0' ? true : false
                },
                'Trials'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/attendance' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'attendance',
                  disabled: selection.id === '0' ? true : false
                },
                'Student Attendance'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/payment' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'makePayment',
                  disabled: selection.id === '0' ? true : false
                },
                'Payment'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/jersey' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'jersey',
                  disabled: selection.id === '0' ? true : false
                },
                'Jersey Issue'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/total' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'totalCollection',
                  disabled: selection.id === '0' ? true : false
                },
                'Total Collection (Today)'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/coachattendance' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'coach',
                  disabled: selection.id === '0' ? true : false
                },
                'Coach Attendance'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/notes' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'notes',
                  disabled: selection.id === '0' ? true : false
                },
                'Notes to HQ'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/students' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'student',
                  disabled: selection.id === '0' ? true : false
                },
                'Students Profile'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/makeup' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'makeUp',
                  disabled: selection.id === '0' ? true : false
                },
                'Make Up List'
              )
            )
          ));
        } else if (user.assignedRoles === 'Head Coach') {
          menuHTML.push(_react2.default.createElement(
            'div',
            { key: 'headcoachmenu' },
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/coachattendance' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'coach',
                  disabled: selection.id === '0' ? true : false
                },
                'Coach Attendance'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/coachschedule' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'coachSchedule',
                  disabled: selection.id === '0' ? true : false
                },
                'Coach Scheduling'
              )
            )
          ));
        } else if (user.assignedRoles === 'Manager') {
          menuHTML.push(_react2.default.createElement(
            'div',
            { key: 'managermenu' },
            (0, _helper.isSuperAdmin)(auth.email) ? _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/dashboard' },
              _react2.default.createElement(
                'button',
                { className: 'mainbtn', id: 'dashboard' },
                'Dashboard'
              )
            ) : null,
            (0, _helper.isSuperAdmin)(auth.email) ? _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/totalhq' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'totalCollectionHQ',
                  disabled: selection.id === '0' ? true : false
                },
                'Total Collection (HQ)'
              )
            ) : null,
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/trials' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'trials',
                  disabled: selection.id === '0' ? true : false
                },
                'Trials'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/jersey' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'jersey',
                  disabled: selection.id === '0' ? true : false
                },
                'Jersey Issue'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/attendance' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'attendance',
                  disabled: selection.id === '0' ? true : false
                },
                'Student Attendance'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/attendance/summary' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'attendanceSummary',
                  disabled: selection.id === '0' ? true : false
                },
                'Attendance Summary'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/payment' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'makePayment',
                  disabled: selection.id === '0' ? true : false
                },
                'Payment'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/makeup' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'makeUp',
                  disabled: selection.id === '0' ? true : false
                },
                'Make Up List'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/payment/notpaid' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'paymentnotpaid',
                  disabled: selection.id === '0' ? true : false
                },
                'Not Paid List'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/payment/report' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'paymentReport',
                  disabled: selection.id === '0' ? true : false
                },
                'Payment Report (HQ)'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/total' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'totalCollection',
                  disabled: selection.id === '0' ? true : false
                },
                'Total Collection (Today)'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/coachattendance' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'coach',
                  disabled: selection.id === '0' ? true : false
                },
                'Coach Attendance'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/coachattendancehq' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'coach',
                  disabled: selection.id === '0' ? true : false
                },
                'Coach Attendance (HQ)'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/coachschedule' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'coachSchedule',
                  disabled: selection.id === '0' ? true : false
                },
                'Coach Scheduling'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/notes' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'notes',
                  disabled: selection.id === '0' ? true : false
                },
                'Notes to HQ'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/notes/all' },
              _react2.default.createElement(
                'button',
                { className: 'mainbtn', id: 'notesall' },
                'Notes Inbox'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/charts' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'charts',
                  disabled: selection.id === '0' ? true : false
                },
                'Charts'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/students' },
              _react2.default.createElement(
                'button',
                {
                  className: 'mainbtn',
                  id: 'student',
                  disabled: selection.id === '0' ? true : false
                },
                'Students Profile'
              )
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: 'm/coaches' },
              _react2.default.createElement(
                'button',
                { className: 'mainbtn' },
                'Coaches Profile'
              )
            )
          ));
        }
      }

      return _react2.default.createElement(
        _reactBootstrap.Grid,
        { style: { marginTop: '10px' } },
        _react2.default.createElement(
          _reactBootstrap.Row,
          null,
          _react2.default.createElement(
            _reactBootstrap.Col,
            { xs: 12, md: 12 },
            _react2.default.createElement(
              _reactBootstrap.FormGroup,
              {
                style: { textAlign: 'center', margin: '3px 5px', width: '100%' }
              },
              _react2.default.createElement(
                _reactBootstrap.ControlLabel,
                null,
                'Select Centre'
              ),
              _react2.default.createElement(
                _reactBootstrap.FormControl,
                {
                  id: 'centreSelect',
                  componentClass: 'select',
                  placeholder: 'select',
                  onChange: this.handleSelect.bind(this),
                  defaultValue: selection.key
                },
                centreOptions
              )
            ),
            menuHTML
          )
        )
      );
    }
  }]);

  return MainMenu;
}(_react2.default.Component);

function mapStateToProps(state) {
  return {
    selection: state.selection,
    centres: state.centres,
    users: state.users,
    auth: state.auth
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps)(MainMenu);

/***/ })

});