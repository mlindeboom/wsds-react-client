import React, { Component } from 'react';


class TimerGreeting extends Component {

 constructor(props) {
    super(props);
    this.state = {
      greeting: ''
    };
    console.log(JSON.stringify(this.state))
  }



 async componentDidMount() {
      try {
        setInterval(async () => {
          const url = 'https://asx8f3580e.execute-api.us-east-1.amazonaws.com/LATEST/greeting';
          //no-corse preventsx-connectorid from getting into the header...enable cors preflight on api gateway
          var mode = {mode: 'cors', headers: {'connectionId': this.props.connectionId}};
          var response = await fetch(url,mode);
          if(response.ok){
            const json = await response.json();
            

            this.setState({
              greeting: json.greeting,
            });

          } else {
            this.setState({
              greeting: 'unauthorized',
            });
          }
        },30000);
      } catch(e) {
        console.log(e);
      }
  }
  render () {
    return (
        <React.Fragment>
          <p>{this.state.greeting}</p>
        </React.Fragment>
    );
  }
}

export default TimerGreeting;