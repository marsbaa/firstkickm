import React from 'react'
import {ButtonToolbar, Button, Glyphicon} from 'react-bootstrap'
import button from 'styles.css'
import _ from 'lodash'
import {Link} from 'react-router'

export var CentreRow = React.createClass({

render: function() {
  const centre = this.props.c;
  return (
      <tr style={{textAlign: 'center', verticalAlign: 'middle'}}>
        <td>{centre.id}</td>
        <td>{_.capitalize(centre.name)}</td>
        <td>
           <Link to={"/m/cp/"+centre.id}>
             <button className="btn"><Glyphicon glyph="pencil" /></button>
           </Link>
        </td>
      </tr>

  )
}
});

export default (CentreRow);
