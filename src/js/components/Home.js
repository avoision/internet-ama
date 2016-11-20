import React from 'react';
import TopNav from './TopNav'
import FutureView from './FutureView'
import UserInterface from './UserInterface'
import Login from './Login'

class Home extends React.Component {
  constructor() {
    super();

    this.baseURL = "127.0.0.1:3000"

    this.processFortune = this.processFortune.bind(this)
    this.disableUI = this.disableUI.bind(this)
    this.setClick = this.setClick.bind(this)
    this.overrideProphecy = this.overrideProphecy.bind(this)
    this.toggleAudio = this.toggleAudio.bind(this)
    this.speakTheWord = this.speakTheWord.bind(this)

    this.state = {
      isShared: false,
      clickable: true,
      blurry: false,
      uiDisabled: false,
      audioOn: false,
      shareLinks: {
        facebook: '',
        url: ''
      },
      prediction: {
        authorURL: null,
        tweetURL: null,
        text: `I am the Internet, AMA.`
      }
    }    
  }

  componentDidMount() {
    if (this.props.pathname === "/share") {
      // http://127.0.0.1:3000/share?id=797630177425510401&f=1&c=15&a=1
      var urlParamsObj = this.props.location.query

      // Get params from URL string
      var sharedParams = {}

      sharedParams.id = urlParamsObj.id
      sharedParams.canUseFull = parseInt(urlParamsObj.f),
      sharedParams.cutPhrasePos = parseInt(urlParamsObj.c),
      sharedParams.audioOn = parseInt(urlParamsObj.a)

      // State vars
      var audioOn,
          clickable = false,
          isShared = true,
          uiDisabled = true

      var audioOn = (sharedParams.audioOn) ? true : false

      this.setState({
        clickable: clickable,
        isShared: isShared,
        uiDisabled: uiDisabled,
        audioOn: audioOn
      })

      this.getSharedData(sharedParams)
    }
  }


  getSharedData(sharedParams) {
    var that = this

    fetch(`/showTweet?id=${sharedParams.id}`, {
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
          that.processSharedFortune(data, sharedParams)
        });  
      }  
    )  
    .catch(function(err) {  
      // Handle error better here.
      console.log('Fetch Error get sharedData:-S', err);  
    });
  }


  processSharedFortune(data, sharedParams) {
    // console.log(sharedParams)
    // console.log(data)

    var prediction = {...this.state.prediction}
    var shareLinks = {... this.state.shareLinks}

    var text
    if (sharedParams.canUseFull) {
      text = data.text
    } else {
      text = data.text.slice(sharedParams.cutPhrasePos)
    }

    var screen_name = data.user.screen_name
    var authorURL = `https://twitter.com/${screen_name}`

    prediction.text = text
    prediction.authorURL = authorURL
    prediction.tweetURL = `${authorURL}/status/${sharedParams.id}`

    shareLinks.url = `${this.baseURL}/share?id=${sharedParams.id}&f=${sharedParams.canUseFull}&c=${sharedParams.cutPhrasePos}&a=${sharedParams.audioOn}`

    this.setState({ 
      prediction: prediction,
      shareLinks: shareLinks
    })

    if (this.state.audioOn) {
      this.speakTheWord()      
    }

    this.setClick(true)
    this.enableUI()      
  }


  sorry() {
    var apologies = [
      'Sorry, things are unclear at this time.',
      'Things are difficult to see.',
      'The future is in flux.',
      'The spirits are silent on this matter.',
      'No clear path has presented itself.'
    ]

    var randomNum = Math.floor(Math.random() * (apologies.length)),
        randomApology = apologies[randomNum]

    return randomApology
  }
  setClick(status) {
    if (status === true) {
      this.setState({ clickable: true })
    } else if (status === false) {
      this.setState({ clickable: false })
    }
  }
  disableUI() {
    this.setState({ uiDisabled: true })
  }
  enableUI() {
    this.setState({ uiDisabled: false })
  }
  addBlur() {
    this.setState({ blurry: true })
  }
  removeBlur() {
    this.setState({ blurry: false })    
  }  
  overrideProphecy(text) {
    var prediction = {...this.state.predicition}

    prediction.text = text
    prediction.authorURL = null
    prediction.tweetURL = null

    this.setState({
      blurry: false,
      prediction: prediction
    }, function() {
      if (this.state.audioOn) {
        this.speakTheWord()      
      }
    })
  }
  processFortune(data) {
    this.removeBlur()

    var type              = data.responseType,
        originalMessage   = data.originalMessage,
        cutPhrase         = data.cutPhrase,
        allPosts          = data.allPosts

    // console.log('type: ' + type)
    // console.log('original: ' + originalMessage)
    // console.log('cutPhrase: ' + cutPhrase)

    var totalPosts = allPosts.length

    var prediction = {...this.state.prediction}
    var shareLinks = {... this.state.shareLinks}    

    if (totalPosts > 0) {
      var randomNum = Math.floor(Math.random() * (totalPosts)),
          randomPost = allPosts[randomNum],
          cutPhrasePos = randomPost.cutPhrasePos,
          text

console.log(randomPost.tweetOriginal)
console.log(randomPost.tweetText)
console.log('\n')

      // Can we use the full tweet, unaltered?
      if (randomPost.canUseFull) {
        text = randomPost.tweetText.charAt(0).toUpperCase() + randomPost.tweetText.slice(1)
      } else {
        text = randomPost.tweetText.slice(cutPhrasePos)
        text = text.charAt(0).toUpperCase() + text.slice(1)
      }

      prediction.text = text
      prediction.authorURL = randomPost.authorURL
      prediction.tweetURL = randomPost.tweetURL

      shareLinks.url = `${this.baseURL}/share?id=${randomPost.tweetID}&f=${randomPost.canUseFull}&c=${randomPost.cutPhrasePos}&a=${this.state.audioOn}`

      this.setState({ 
        prediction: prediction,
        shareLinks: shareLinks
      })

    } else {
      prediction.text = this.sorry()
      prediction.authorURL = null
      prediction.tweetURL = null

      shareLinks.url = ""

      this.addBlur()

      this.setState({ 
        prediction: prediction,
        shareLinks: shareLinks
      })
    }

    if (this.state.audioOn) {
      this.speakTheWord()      
    } 

    this.setClick(true)
    this.enableUI()
  }


  toggleAudio() {
    var audioOn = this.state.audioOn
    audioOn = !audioOn
    this.setState({ audioOn: audioOn })

    if (audioOn) {
      this.speakTheWord()
    }
  }

  // I am a Queensryche nerd. I can't help myself.
  speakTheWord() {
    var synth = window.speechSynthesis;

    // Prevent cacophony   
    if (synth.speaking !== true) {
      var utterance = new SpeechSynthesisUtterance()      
      utterance.lang = 'en-US';
      utterance.volume = 1.0;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.text = this.state.prediction.text;
      synth.speak(utterance)
    }
  }

  render() {
    var userControls,
        elem = document.getElementsByTagName('body')[0]

    if (elem.classList.contains('auth')) {
      userControls = <UserInterface processFortune={this.processFortune} disableUI={this.disableUI} uiDisabled={this.state.uiDisabled} clickable={this.state.clickable} setClick={this.setClick} overrideProphecy={this.overrideProphecy} />
    } else {
      userControls = <Login />
    }

    return (
      <div>
        <header>
          <div className="shareLink"><span className="sharePrompt">Share:</span> {this.state.shareLinks.url}</div>        
          <TopNav />
        </header>
        <FutureView prediction={this.state.prediction} blurry={this.state.blurry} audioOn={this.state.audioOn} toggleAudio={this.toggleAudio} />

        <div className="base">
          {userControls} 
        </div>

      </div>
    )
  }
}

export default Home


