import React from 'react';

class Mininav extends React.Component {
  constructor() {
    super();

    this.goToOriginal = this.goToOriginal.bind(this)    
  }

  goToOriginal() {
    if (this.props.prediction.tweetURL !== null) {
      window.open(this.props.prediction.tweetURL)
    }
  }



  render() {
    var audioIconLi = '',
        audioIconClass = ''

    if (this.props.speechSupport) {
      audioIconClass = "icon-volume-off"

      if (this.props.audioOn) {
        audioIconClass = "icon-volume-up lit"
      }

      audioIconLi = <li><span className={audioIconClass} onClick={this.props.toggleAudio}></span></li>    
    } 

    var authorIconClass = "icon-user"
    if (this.props.prediction.authorURL !== null) {
      authorIconClass = "icon-user lit"
    }

    return (
      <div className="mininav">
        <ul className="nav-items">
          <li><span className={authorIconClass} onClick={this.goToOriginal}></span></li>

          {audioIconLi}

      
        </ul>
      </div>
    )
  }
}

export default Mininav