import React from "react";
import { FormControl, ControlLabel, FormGroup } from "react-bootstrap";
import TermTabs from "TermTabs";

class TermDatesSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      terms: 6
    };
  }

  handleChange(e, value) {
    e.preventDefault();
    this.setState({
      terms: e.target.value
    });
  }

  componentDidMount() {
    document.getElementById("selectNumOfTerms").value = this.state.terms;
  }

  render() {
    return (
      <div>
        <FormGroup>
          <ControlLabel>No. of Terms</ControlLabel>
          <FormControl
            id="selectNumOfTerms"
            componentClass="select"
            placeholder="select"
            onChange={this.handleChange.bind(this)}
          >
            <option value="6">6</option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </FormControl>
        </FormGroup>
        <TermTabs numOfTerms={this.state.terms} year={this.props.year}/>
      </div>
    );
  }
}

export default TermDatesSelector;
