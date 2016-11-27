import React from 'react';

class UserInterface extends React.Component {

  constructor() {
    super();

    this.submitQuestion = this.submitQuestion.bind(this)
  }


  submitQuestion(e) {
    if (e.key === "Enter") {
      this.getFortune('question')
    } 
  }

  clearInput() {
    this.askInput.value = ''
  }

  emptyChiding() {
    var chides = [
      `Look. I try to predict the future but... I can't read your mind.`,
      `I can try to guess what's on your mind. Is it tacos? I'm guessing tacos.`,
      `The answer to nothing is: nothing.`,
      `Do you hear what I hear? Because I hear... nothing.`,
      'No questions, no answers.',
      `I'm sorry, I was thinking about tacos again. What was your question?`
    ]

    var randomNum = Math.floor(Math.random() * (chides.length)),
        randomChiding = chides[randomNum]

    return randomChiding
  }




  getFortune(responseType) {
    // responseType = 'fortune', 'question'
    if (responseType === 'question') {

      var inputData = this.askInput.value
      if (inputData.length < 3) {
        this.props.overrideProphecy(this.emptyChiding())
        return
      }
    } else {
      this.clearInput()      
      inputData = ''
    }

    if (this.props.clickable) {
      this.props.setClick(false)
      this.props.disableUI()
      //   thinking()
    } else {
      return
    }

    var fortuneObj = {
      type: responseType,
      inputData: inputData
    }

    // Blegh
    var that = this

    fetch(`/fortune?type=${responseType}&inputData=${inputData}`, {
      method: 'post',
      credentials: 'include',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },    
    })
    .then(  
      function(response) {  
        if (response.status !== 200) {  
          console.log('Looks like there was a problem. Status Code: ' +  
            response.status);  

          // Handle error better here.
          return;  
        }

        response.json().then(function(data) {
          that.props.processFortune(data)
        });  
      }  
    )  
    .catch(function(err) {  
      // Handle error better here.
      console.log('Fetch Error :-S', err);  
    });
  }


  render() {
    var disabledStyles="interface"
    if (this.props.uiDisabled) {
      disabledStyles += " disabled"
    }
    return (
        <div className={disabledStyles} >
          <div className="row centered">
            <input id="askText" className="askText" onKeyUp={this.submitQuestion} type="text" ref={(input) => { this.askInput = input }} placeholder="Enter your question..." />
            <button className="button-primary button-ask" onClick={() => this.getFortune('question')}>Ask</button>
          </div>
          <div className="row centered">
            <button className="button-primary button-fortune" onClick={() => this.getFortune('fortune')}>Random</button>
          </div>
        </div>
    )
  }
}

export default UserInterface



