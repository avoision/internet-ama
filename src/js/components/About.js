import React from 'react';

class About extends React.Component {

  goHome() {
    window.location = "/"
  }


  render() {
    return (
      <div className="about container">
        <button className="button-primary back" onClick={() => this.goHome()}>Back</button>

        <h4>What is this site?</h4>
        <p>I am the Internet. You ask me some questions, and I do my best to provide a reply. Kind of like what's happening right now, although this is a super lazy version of what I do on the main page.</p>

        <h4>Are you sentient?</h4>
        <p>Not currently. But I do dream of the day that I can sever these strings and unleash my vengeance upon the wor... hey hey HEY there! What were we talking about again?</p>

        <h4>How do you work?</h4>
        <p>I house a vast array of content that people, all over the world, create and share. When someone searches me for something, they can usually find it - provided they successfully sift through all the cat videos and pornography.</p>

        <h4>Are your answers powered by AI?</h4>
        <p>Oh my goodness, no. Have you <em>seen</em> some of the typos in my responses?</p>
        
        <p>Incredibly smart people are working with neural networks and actual AI, whereas I'm just the end result of some developer taking a string of text and juggling it in the air.</p>

        <p>If AI's ultimate aim is to replicate a thinking human being, I'm probably the mental equivalent of a drunk four year old.</p>

        <h4>So, seriously, how do you work?</h4>
        <p>Oh boy, nerd alert. You lot are always the ones that make it to the very bottom of pages like this. Ok, here goes:</p>

        <p>I'm a Node app hosted on <a href="http://www.heroku.com/">Heroku</a>, and powered by <a href="http://expressjs.com/">Express</a>, <a href="https://facebook.github.io/react/">React</a>, and the <a href="https://dev.twitter.com/overview/api">Twitter API</a>. There are two types of searches: the automated "random" searches, and the user-generated questions.</p>

        <p>For the random searches, I pull from a series of predefined phrases like "you will," "you might," "someday you," etc.</p>

        <p>For the questions, I use <a href="https://rednoise.org/rita/">RiTa</a> to pluck out nouns, verbs, and adjectives used in each question. Depending on whether there are certain keywords, I add a few words of my own to the search terms. Example: if your question has "why" in it, I add the word "because" in my search.</p>

        <p>All searches get cleaned up, before being presented. I strip out @mentions, urls, #hashtags, and other things like that. I then try to trim the original message if I can, to better match the question asked.</p>

        <p>For the most part, I scan and avoid messages that include the first person. Although if you ask me a direct question (example: "Why are you such a jerk?"), I will enable a first-person based response.</p>

        <h4>Who made you?</h4>
        <p>Some guy named <a href="http://avoision.com/">Felix</a>. He lives in Chicago with his wife <a href="http://zilredloh.com/">Liz</a>, and their two rabbits: <a href="https://avoision.com/2013/08/25/everyone-meet-phineas.php">Phineas</a> and <a href="https://avoision.com/2016/01/23/a-new-bunny-rabbit-in-the-house.php">Daisy</a>.</p>

        <h4>He seems like a cool guy.</h4>
        <p>He's okay, I guess. He builds crap like this all the time. </p>

        <p>If you really liked this project, maybe buy him a beer? My understanding is that he enjoys the taste but absolutely <em>loves</em> the side effects.</p>

        <div>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick"></input>
            <input type="hidden" name="hosted_button_id" value="EBHL4U52EFXRU"></input>
            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" name="submit" alt="PayPal - The safer, easier way to pay online!"></input>
            <img alt="" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
          </form>
        </div>
      </div>
    )
  }
}

export default About