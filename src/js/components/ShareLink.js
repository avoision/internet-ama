import React from 'react';

class ShareLink extends React.Component {

  render() {
    var shareStyle = "shareLink hidden"
    if (this.props.url !== "") {
      shareStyle = "shareLink"
    }

    return (
      <div className={shareStyle}><span className="sharePrompt"></span> <a href={this.props.url} target="_blank" rel="noopener noreferrer">{this.props.url}</a></div>
    )
  }
}

export default ShareLink





