import React from 'react'
import {browserHistory} from 'react-router'
import {connect} from 'react-redux'
var actions = require('actions')


class EnsureLoggedIn extends React.Component {
  componentDidMount() {
    const { dispatch, currentURL, isLoggedIn, redirect} = this.props

    if (!isLoggedIn) {
      // set the current url/path for future redirection (we use a Redux action)
      // then redirect (we use a React Router method)
      dispatch(actions.setRedirectUrl(currentURL))
      browserHistory.replace("/")
    }
    else {
      browserHistory.replace(redirect)
    }
  }

  render() {
    const {currentURL, isLoggedIn} = this.props
      if (isLoggedIn) {
        return this.props.children
      } else {
        return null
      }
  }
}

// Grab a reference to the current URL. If this is a web app and you are
// using React Router, you can use `ownProps` to find the URL. Other
// platforms (Native) or routing libraries have similar ways to find
// the current position in the app.
function mapStateToProps(state, ownProps) {
  return {
    isLoggedIn: state.auth.loggedIn,
    currentURL: ownProps.location.pathname
  }
}

export default connect(mapStateToProps)(EnsureLoggedIn)
