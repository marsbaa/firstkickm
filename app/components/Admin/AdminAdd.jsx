import React from 'react'
var {connect} = require('react-redux')
import {Field, reduxForm, formValueSelector} from 'redux-form'
import {Row,Col} from 'react-bootstrap'
var actions = require('actions')
import _ from 'lodash'
import {browserHistory, Link} from 'react-router'


class AdminAdd extends React.Component{
  renderField(field) {
    const {meta : {touched, error}} = field
    const className =  `form-group ${touched && error? 'has-error' :''}`

    return (
      <div className = {className}>
        <label>{field.label}</label>
        <input
          className={field.className}
          type={field.type}
          {...field.input}
          />
        <div className="help-block">{touched?error:''}</div>

      </div>
    )
  }

  generatePass() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var pass = "";

    for (let i = 0; i < 8; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }

    return pass;
  }


  onSubmit(values) {
    var {dispatch} = this.props
    var password = this.generatePass()
    var admin = {
      name: values.name,
      email: values.email,
      password
    }
    dispatch(actions.addNewAdmin(admin))
  }

  render() {
    const {handleSubmit, admins} = this.props
    return(
      <div style={{marginTop: '20px'}}>
        <Row style={{padding: '25px'}}>
          <Col md={6}>
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <Field
                label="Name"
                className="form-control"
                type="text"
                name="name"
                validate={(value) => (value ? undefined : 'Required')}
                component={this.renderField}
                />
              <Field
                  label="Email"
                  className="form-control"
                  type="text"
                  name="email"
                  validate={ (value) =>
                        (_.find(admins, {'email': value}) === undefined ? undefined : 'Email already taken. Try using another email.'
                      )
                    }
                  component={this.renderField}
                  />

                <button style={{marginTop:'40px'}} type="submit" className="submitbtn">Submit</button>
            </form>
          </Col>
        </Row>
      </div>
    )
  }
}

function validate(values) {
  const errors = {}
  if (!values.name) {
    errors.name = "Enter a name"
  }
  if (!values.email) {
    errors.email = "Enter a valid email"
  }
  return errors
}



AdminAdd = reduxForm({
  form: 'AdminAdd'
})(AdminAdd)

const selector = formValueSelector('AdminAdd')


AdminAdd = connect(
  state => {
    const nameValue = selector(state, 'name')
    const emailValue = selector(state, 'email')
    return {
      nameValue,
      emailValue,
      admins: state.admins
    }
  }
)(AdminAdd)

export default AdminAdd
