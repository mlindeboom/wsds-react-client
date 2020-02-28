import React, { Component } from 'react';
import './App.css';
import WebSocketControls from './WebSocketControls';
import TimerGreeting from './TimerGreeting';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myConnectionId: '',
      myCallback: (connectionId) => {
        console.log('App connectionId is '+ connectionId);
        this.setState({myConnectionId: connectionId});
      }
    };
  }

render() {

  return (
    <div className="App">
      <header className="App-header">
        <WebSocketControls callbackFromParent={this.state.myCallback}/>
        <TimerGreeting connectionId={this.state.myConnectionId}/>
      </header>
    </div>
  );
  }
}
export default App;
