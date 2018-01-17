import React from "react";
import { connect } from "react-redux";
import filter from 'lodash/filter'

class IncomeList extends React.Component {
  render() {
      const {classes} = this.props
    const columns = [
        { key: 'ageGroupStartTime', name: 'Class' },
    ]
  

    return (
      <div>
        {Object.keys(classes).map(key=>{
            const {name} = classes[key]
            return <h4>{name}</h4>
        })}
      </div>
    );
  }
}

function mapStateToProps (state, props) {
    return {
        classes: filter(state.classes, {centreKey: props.centreKey}),
        students: state.students
    }
}

export default connect(mapStateToProps)(IncomeList);
