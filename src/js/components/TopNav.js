import React from 'react';
import { Link } from 'react-router'

class TopNav extends React.Component {

  render() {
    return (
      <div className="topnav-container">
        <ul className="topnav">
          <li><Link to="/about">about</Link></li>
        </ul>
      </div>
    )
  }
}

export default TopNav