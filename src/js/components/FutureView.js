import React from 'react';

import Mininav from './Mininav'
import Socialnav from './Socialnav'

class FutureView extends React.Component {
  constructor() {
    super();
  }


  componentDidMount() {
    // var prediction = {...this.props.prediction}

    // this.setState({
    //   prediction: prediction
    //   })

    // console.log(this.state)    
  }



  render() {
    var blurStyles

    if (this.props.blurry) {
      blurStyles = "blurry"
    }

    return (
      <div className="futureView">
        <div id="prophecy" className={blurStyles}>{this.props.prediction.text}</div>
        <Mininav prediction={this.props.prediction} toggleAudio={this.props.toggleAudio} audioOn={this.props.audioOn} />        
        {/* <Socialnav />*/}
        <canvas id="canvas"></canvas>  
      </div>
    )
  }







}
export default FutureView
