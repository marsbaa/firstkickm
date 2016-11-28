import React from 'react';
import {Tabs, Tab} from 'react-bootstrap'
import MultipleDayPicker from 'MultipleDayPicker'

export var TermTabs = React.createClass({
  getInitialState: function() {
    return {
      key : 1
    };
  },

  handleSelect(key) {
    this.setState({key});
  },

  TabContent(tabs) {
    var html = [];
    for (var i=0; i < tabs; i++) {
      var count = i+1;
      html.push(<Tab key={"tab"+count} eventKey={count} title={"T" + count}>
        <MultipleDayPicker ref={"mdp"+count} key={"MDP"+count}/>
      </Tab>
    );
   };
   return html;
 },

  render: function () {
  const numOfTabs = this.props.terms;
     return (
       <Tabs defaultActiveKey={this.state.key} onSelect={this.handleSelect} id="tabsSelector">
         {this.TabContent(numOfTabs)}
       </Tabs>
     );
   }
});

export default (TermTabs);
