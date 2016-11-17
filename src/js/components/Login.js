import React from 'react';

class Login extends React.Component {

  twitterLogin() {
    window.location = "/auth/twitter";
  }

  render() {
    return (
      <div className="login row centered">

        <button className="button-primary twitter-login" onClick={() => this.twitterLogin()}><span className="icon-twitter"></span> Login</button>

      </div>



    )
  }
}

export default Login