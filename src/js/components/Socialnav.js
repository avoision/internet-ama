import React from 'react';

class Socialnav extends React.Component {
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
    return (
      <div className="socialnav">
        <ul className="nav-items">
          <li><span className="icon-facebook"></span></li>
          <li><span className="icon-link"></span></li>
        </ul>
      </div>
    )
  }
}

export default Socialnav