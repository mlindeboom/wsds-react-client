
import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import keys from './keys';


class WebSocketControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        socket : {},
        isConnected : false,
        token : ''        
    };
  }



  makeConnection(){
    if(!this.state.isConnected){
      console.log('connecting...');
      //establish a web socket connect and initialize processing for incoming message
      var mysocket = new WebSocket('wss://nz0t7cxbq9.execute-api.us-east-1.amazonaws.com/development');
      mysocket.onmessage = (e) => {this.messageProcessing(e)}


      this.setState({
        socket : mysocket, //WebSocket('ws://echo.websocket.org'),
        isConnected : true
      });

    }
  }

  breakConnection(){
    if(this.state.isConnected) {
      console.log('disconnecting...');
      this.state.socket.close();
      this.setState({
          isConnected : false
      });
    }
  }

  sendMessage(executionResult){
    //send a socket message with the results and the step function token
    var message = {
      action: "OnMessage", 
      msg: executionResult,
      token: this.state.token
    };
    console.log('Sending with token:' + JSON.stringify(message));

    this.state.socket.send(JSON.stringify(message));
  }

  messageProcessing(e){
    /*execute code sent from web socket connection and return result
    back through the web socket*/
    console.log('incoming:' + e.data);
    if (e.data.includes("function")){
      
      //a function was detected so extract it and execute it
      var mydata = JSON.parse(e.data);
      //grab and store the step function token to use later to complete the step task
      this.setState({token: mydata.token});


      //execute the function
      console.log('About to execute function:' + mydata.func);
      var as_func = eval('(' + mydata.func + ')');
      var result = as_func(keys);
      console.log('Result from executing function:' + JSON.stringify(result));

      //add the index value to the result in order to pass it on
      result.index = mydata.index;

      //return the result via the web socket
      this.sendMessage(result);
    } else {
      //get and store connectionId
      var result = e.data.split(' ');
      console.log('Setting connectionId to '+result[1])
      this.setState({connectionId: result[1]});
      //send the connectionId to the parent of this component
      this.props.callbackFromParent(this.state.connectionId);
    }
  }

  
  

  render() {
    let connectionState;

    if (this.state.isConnected) {
      connectionState = <h1>Connected</h1>;
    } else {
      connectionState = <h1>Not Connected</h1>;
    }



    return (
        <React.Fragment>
        {connectionState}
        <ButtonToolbar>
          <Button variant="primary"  onClick={(e) => this.makeConnection()}>Connect</Button>
          <Button variant="primary"  onClick={(e) => this.breakConnection()}>Disconnect</Button>
        </ButtonToolbar>      
        </React.Fragment>
    );
  }
}

export default WebSocketControls;