import React from "react";
import PropTypes from 'prop-types'



class SwitchButton extends React.Component{


  // Handle change
  handleChange()
  {
    // Override
  }

  render()
  {
    let id, label, labelRight,
        mode = this.props.mode || "switch";

    if( this.props.id === '' && this.props.name !== '' ) {
      id = this.props.name;
    }

    if( this.props.label !== '' ) {
      label = (
        <label htmlFor={id}>{this.props.label}</label>
      );
    }

    if( this.props.labelRight !== '' ) {
      labelRight = (
        <label htmlFor={id}>{this.props.labelRight}</label>
      );
    }

    if( [ 'switch', 'select' ].indexOf( mode ) < -1 ) {
      mode = "switch";
    }

    return (
      <div className={'rsbc-switch-button rsbc-mode-' + mode + ' ' + this.props.theme + ( this.props.disabled ? " disabled" : "") }>
        {label}
        <input onChange={this.props.onChange}
               disabled={this.props.disabled}
               id={id} name={this.props.name}
               type="checkbox"
               checked={this.props.checked}
               value="1"/>
        <label htmlFor={id}>
        </label>
        {labelRight}
      </div>
    );
  }
}

SwitchButton.propTypes = {
  id             : PropTypes.string,
  name           : PropTypes.string,
  title          : PropTypes.string,
  label          : PropTypes.string,
  labelRight     : PropTypes.string,
  defaultChecked : PropTypes.bool,
  disabled       : PropTypes.bool,
  theme          : PropTypes.string,
  checked        : PropTypes.bool,
  mode           : PropTypes.string,
  onChange       : PropTypes.func
}

SwitchButton.defaultProps = {
  id             : '',
  name           : 'switch-button',
  title          : '',
  label          : '',
  labelRight     : '',
  disabled       : false,
  defaultChecked : false,
  theme          : 'rsbc-switch-button-flat-round',
  checked        : null,
  mode           : "switch",
  onChange       : SwitchButton.prototype.handleChange
}

export default SwitchButton;
