import React from 'react';
import {Tabs, Tab} from 'react-bootstrap'
import MultipleDayPicker from 'MultipleDayPicker'

class TermTabs extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      key : 1
    }
  }

  handleSelect(key) {
    this.setState({key});
  }

  TabContent(tabs) {
    var html = [];
    for (var i=0; i < tabs; i++) {
      var count = i+1;
      html.push(<Tab key={"tab"+count} eventKey={count} title={"T" + count}>
        <MultipleDayPicker ref={"mdp"+count} key={count} tab={count}/>
      </Tab>
    );
   };
   return html;
 }

  render() {
     return (
       <Tabs defaultActiveKey={this.state.key} onSelect={this.handleSelect.bind(this)} id="tabsSelector">
         {this.TabContent(this.props.numOfTerms)}
       </Tabs>
     );
   }
}

export default (TermTabs);
