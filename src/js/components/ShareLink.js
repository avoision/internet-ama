import React from 'react';

class ShareLink extends React.Component {

  getTwitterLink() {
    var twitterLink = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(this.props.url)

    return twitterLink
  }

  getFacebookLink() {
    var facebookLink = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.props.url)

    return facebookLink
  }


  render() {
    var shareStyle = "shareLink hidden"
    if (this.props.url !== "") {
      shareStyle = "shareLink"
    }

    return (
      <div className={shareStyle}><span className="sharePrompt">Share this answer via:</span> <a href={this.getFacebookLink()} target="_blank" rel="noopener noreferrer">Facebook</a> or <a href={this.getTwitterLink()} target="_blank" rel="noopener noreferrer">Twitter</a>

      </div>
    )
  }
}

export default ShareLink





