import React from 'react';

import Mininav from './Mininav'
import Socialnav from './Socialnav'

class FutureView extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    window.animate()
  }

  componentWillUnmount() {
    window.stopAnimation()
  }

  render() {
    var blurStyles

    if (this.props.blurry) {
      blurStyles = "blurry"
    }

    return (
      <div className="futureView">
        <div id="prophecy" className={blurStyles}>{this.props.prediction.text}</div>
        <Mininav prediction={this.props.prediction} speechSupport={this.props.speechSupport} toggleAudio={this.props.toggleAudio} audioOn={this.props.audioOn} />        
        <canvas id="canvas"></canvas> 
      </div>
    )
  }
}
export default FutureView
