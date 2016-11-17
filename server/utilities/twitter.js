module.exports = function(app, passport) {

var _           = require('lodash')
var async       = require('async')
var Twit        = require('twit')
var rita        = require('rita');
var wordfilter  = require('wordfilter')

var configAuth  = require('../config/auth');

var User        = require('../models/user');
var Session     = require('../models/session');

console.log("twitter.js Loaded")


app.post('/showTweet', function(req, res) {
  console.log('Show Tweet Reached!!')

  var t = new Twit({
    consumer_key:           configAuth.twitterAuth.consumerKey,
    consumer_secret:        configAuth.twitterAuth.consumerSecret,
    access_token:           req.user.twitter.token,
    access_token_secret:    req.user.twitter.tokenSecret,
    app_only_auth:          false
  }) 


  t.get(`statuses/show/${req.query.id}`, {
    id: req.query.id,
    include_entities: false
    }, function(err, data, response) {

    if (!err) {
      res.json(data);
    } else {
      console.log(err)
    }
  })

})

app.post('/fortune', function(req, res) {  
  var responseType = req.query.type,
      inputData = req.query.inputData


  var t = new Twit({
    consumer_key:           configAuth.twitterAuth.consumerKey,
    consumer_secret:        configAuth.twitterAuth.consumerSecret,
    access_token:           req.user.twitter.token,
    access_token_secret:    req.user.twitter.tokenSecret,
    app_only_auth:          false
  })  
  
  // Extend Wordfilter
  wordfilter.addWords(['nigg', 'n!gg', 'sjw', 'social justice', 'pussies', 'semen', 'rape']);

  // ===========================
  // Twitter Logic
  // ===========================
  const phrasesArray = [
    'tomorrow you will', 
    'someday you will',
    'you might',
    'you may',
    'there will be',
    'there may be',
    'who knows what',
    'you will receive',
    'you will get',
    'no one knows',
    'no one can',
    'you will find',
    'you will discover',
    'in the future you'
  ]

  randomPhrase = function() {
    var randomNum = Math.floor(Math.random() * phrasesArray.length);
    return phrasesArray[randomNum];
  }


  // ===========================
  // Async Twitter
  // ===========================
  getPublicTweets = function(originalMessage, phrase, responseType, cutPhrase, cb) {
    console.log("========= Get Public Tweets =========");
    // console.log(phrase); 
    // responseType = fortune, reply

    // If this is a search for a fortune, set the cutPhrase
    if (responseType === 'fortune') {
      cutPhrase = phrase
    }

    var coinToss = Math.floor(Math.random() * 100) + 1;
    if ((coinToss%4) != 0) {
        var resultTypePreference = 'recent'
    } else {
        var resultTypePreference = 'popular'
    }

    t.get('search/tweets', {
      q: '\"' + phrase + '\"', 
      count: 100, 
      result_type: resultTypePreference, 
      include_entities: false,
      lang: 'en'
      }, function(err, data, response) {

      if (!err) {
        var botData = {
          allPosts: [],
          responseType: responseType,
          cutPhrase: cutPhrase,
          // cutPhrasePos: null,
          originalMessage: originalMessage
        }

        // Loop through all returned statues
        for (var i = 0; i < data.statuses.length; i++) {

          var tweet       = data.statuses[i].text.toLowerCase(),
              hasReply    = tweet.indexOf('@'), 
              hasHashtag  = tweet.indexOf('#'),
              hasLink     = tweet.indexOf('http'),
              hasAmp      = tweet.indexOf('&')

          var startPos = tweet.indexOf(cutPhrase)

          // Punctuation (commas) may result in -1
          if (startPos < 0) { startPos = 0 }

          // Does the tweet contain offensive words?
          if (!wordfilter.blacklisted(tweet)) {

// console.log(tweet)

            // Find our phrase, and go forward from there.
            var preTweet = tweet
            tweet = tweet.slice(startPos);


            // Does the tweet have a reply, hashtag, or URL?
            if ((hasReply == -1) && (hasHashtag == -1) && (hasLink == -1) && (hasAmp == -1)) {

              preTweet = preTweet.replace(/[?.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")
              tweet = tweet.replace(/[?.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")

              var preTweetArray = preTweet.split(' ')
              var tweetArray = tweet.split(' ')

              var rejectionCriteriaArray = ['i', 'im', 'ive', 'ill', 'id', 'ida', 'my', 'me', 'mine', 'lmao', 'lmfao', 'omg', 'omfg', 'smh', 'smdh', ' lol'];

              var shouldReject = false

              for (var j = 0; j < tweetArray.length; j++) {
                for (var k = 0; k < rejectionCriteriaArray.length; k++) {
                  if (tweetArray[j] === rejectionCriteriaArray[k]) {
                    shouldReject = true
                    break
                  }
                }
                if (shouldReject) { break }
              }

              if (shouldReject) {
                // Rejected. Do not save.
              } else {
                // console.log(data.statuses[i])
                var tweetObj = data.statuses[i],
                    name = tweetObj.user.name,
                    screen_name = tweetObj.user.screen_name,
                    authorURL = `https://twitter.com/${screen_name}`,
                    tweetID = tweetObj.id_str,
                    tweetURL = `${authorURL}/status/${tweetID}`,
                    tweetText = tweetObj.text,
                    cutPhrasePos = startPos,
                    canUseFull = true

                // Check pretweet content
                for (var l = 0; l < preTweetArray.length; l++) {
                  for (var m = 0; m < rejectionCriteriaArray.length; m++) {
                    if (preTweetArray[l] === rejectionCriteriaArray[m]) {
                      canUseFull = false
                      break
                    }
                  }
                  if (canUseFull === false) { break }
                }

                // console.log('tweetObj: ' + tweetObj)
                // console.log('name: ' + name)
                // console.log('screen_name: ' + screen_name)
                // console.log('url: ' + url)
                // console.log('tweetID: ' + tweetID)
                // console.log('tweetURL: ' + tweetURL)
                // console.log('cutPhrasePos: ' + cutPhrasePos)
                // console.log('canUseFull: ' + canUseFull)
                // console.log('tweetText: ' + tweetText)
                // console.log('cut: ' + tweetText.slice(cutPhrasePos))
                // console.log('\n')

                var tweetData = {
                  // tweetObj: tweetObj,
                  name: name,
                  screen_name: screen_name,
                  authorURL: authorURL,
                  tweetID: tweetID,
                  tweetURL: tweetURL,
                  tweetText: tweetText,
                  cutPhrasePos: cutPhrasePos,
                  canUseFull: canUseFull          
                }
                botData.allPosts.push(tweetData)
              }
            }
          }
        }

        if (botData.allPosts.length > 0 ) {
          // Remove duplicates
          // Refactor this, since we are keeping all data
          // botData.allPosts = _.uniq(botData.allPosts)

          cb(null, botData)
        } else {
          // [ Insert Coin ]
          cb("No tweets found", botData)
        }
      } else {
        console.log(err)
        cb("There was an error getting a public Tweet.", err)
      }
    })
  }

  rateLimitCheck = function (botData, cb) {
    t.get('application/rate_limit_status', {resources: 'search'}, function (err, data, response) {
      if (!err) {
        var dataRoot = data.resources.search['/search/tweets'],
          limit = dataRoot.limit,
          remaining = dataRoot.remaining,
          resetTime = dataRoot.reset + "000",
          currentTime = (new Date).getTime().toString(),
          msRemaining = resetTime - currentTime,
          totalSecsRemaining = Math.floor(msRemaining / 1000),
          minRemaining = Math.floor(totalSecsRemaining/60),
          secRemaining = totalSecsRemaining%60;

        if (secRemaining < 10) { secRemaining = "0" + secRemaining; }

        var timeUntilReset = new Date(0);
        timeUntilReset.setUTCSeconds(dataRoot.reset);

        var hour = timeUntilReset.getHours();
        if (hour > 12) { hour = hour - 12; };
        var min = timeUntilReset.getMinutes();
        if (min < 10) { min = "0" + min; };
        var sec = timeUntilReset.getSeconds();
        if (sec < 10) { sec = "0" + sec; };

        // console.log('---------------------------');
        console.log("Rate limit: " + remaining + "/" + limit);
        console.log("Next reset at: " + hour + ":" + min + ":" + sec + " in " + minRemaining + ":" + secRemaining );
        console.log('---------------------------');

        cb(null, botData)
      }
    });
  }





  fin = function(botData, cb) {
    // console.log(botData)
    cb(null, botData)
  }


  // ---------------------------
  // Fortune Async List
  // ---------------------------
  getFortune = function(phrase, responseType, cutPhrase) {
    async.waterfall([
      // async.apply(getPassportID, sessionID),
      // getCredentials,
      // updateTwit,
      async.apply(getPublicTweets, '', phrase, responseType, cutPhrase),
      // removeFirstPerson,
      rateLimitCheck
      // fin
      // rateLimitCheck
    ],
    function(err, botData) {
      if (err) { 
        console.log(err) 
      }
      res.json(botData);
    })
  }


  processInput = function(message, responseType) {
    console.log('--------- processInput ---------')
    // http://rednoise.org/rita/reference/PennTags.html
    var originalMessage = message
    message = message
                .replace(/[?.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")
                .toLowerCase()

    var ignoreArray = ['did', 'had', 'has', 'are']
    var messageArray = message.split(' ')
    messageArray = _.difference(messageArray, ignoreArray)

    message = messageArray.join(' ')

    var messageTags = rita.RiTa.getPosTags(message),     
        searchTerms = [],
        cutPhrase = ''

    if (message.indexOf('why') !== -1) {
      searchTerms.push('because')
      cutPhrase = 'because'
    }

    if (message.indexOf('how ') !== -1) {
        searchTerms.push('you%20should')
        cutPhrase = 'you%20should'
    } else if (message.indexOf('should ') !== -1) {
      if (randomCheck(50)) {
        searchTerms.push('should')
        cutPhrase = 'should'
      } else {
        searchTerms.push('shouldn\'t')
        cutPhrase = 'shouldn\'t'
      }
    }else if (message.indexOf('you ') !== -1) {
      var firstPersonArray = [
        '\"i%20will\"',
        '\"i%20may\"',
        '\"i%20might\"',
        'i\'ll',
        '\"i%20could\"',
        '\"i%20would\"'
      ]

      var randomNum = Math.floor(Math.random() * firstPersonArray.length)
      searchTerms.push(firstPersonArray[randomNum])
      cutPhrase = firstPersonArray[randomNum]

    } else if (message.indexOf('we ') !== -1) {
      var weArray = [
        '\"we%20will\"',
        '\"we%20may\"',
        '\"we%20might\"',
        'we\'ll%20be',
        '\"we%20could\"',
        '\"we%20would\"'
        ]

      var randomNum = Math.floor(Math.random() * weArray.length)
      searchTerms.push(weArray[randomNum])
      cutPhrase = weArray[randomNum]
    }

    if (cutPhrase === '') {
      var maxSearchTerms = 4 
    } else {
      var maxSearchTerms = 5
    }

    for (var i = 0; i < messageTags.length; i++) {
      console.log(messageTags[i])
      console.log(messageArray[i])

      if (messageTags[i].length >= 2) { 
        if ((messageTags[i].indexOf('n') !== -1) ||     // Noun
            (messageTags[i].indexOf('v') !== -1) ||     // Verb
            (messageTags[i].indexOf('jj') !== -1)) {    // Adjective    

          if ((messageArray[i].length >= 3) && (messageArray[i].length <= 10)) {
            searchTerms.push(messageArray[i])
          }
        }
      }
    }  

    if (searchTerms.length > 0) {
      while (searchTerms.length >= maxSearchTerms) {
        var randomNum = Math.floor(Math.random() * searchTerms.length)
        searchTerms.splice(randomNum, 1)
      }

      console.log('\n--------- START ---------');
      var searchPhrase = searchTerms.join('%20')
     
      console.log(searchPhrase)

      // Search Twitter for response
      getReply(originalMessage, searchPhrase, responseType, cutPhrase)

    } else {
      // No search terms found after processing input. 
      var botData = {
        allPosts: [],
        responseType: responseType,
        cutPhrase: cutPhrase,
        originalMessage: originalMessage
      }

      res.json(botData)

    }
  }


  // ---------------------------
  // Reply Async List
  // ---------------------------
  getReply = function(originalMessage, phrase, responseType, cutPhrase) {
    async.waterfall([
      async.apply(getPublicTweets, originalMessage, phrase, responseType, cutPhrase),
      rateLimitCheck
    ],
    function(err, botData) {
      if (err) { 
        console.log(err) 
      }
      res.json(botData);
    })
  }

  checkType = function(responseType, inputData) {
    if (responseType === 'fortune' ) {
      getFortune(randomPhrase(), responseType, '')
    } else {
      processInput(inputData, responseType) // Will trigger getReply when done
    }
  }

  checkType(responseType, inputData)

  })
}


// ===========================
// Utility Functions
// ===========================
// Event X has a 30% chance of happening.
// randomCheck(30) = true/false
randomCheck = function(percentChance, limit) {
  limit = limit || 100

  var randomNum = Math.floor(Math.random() * limit);
  if ((percentChance - randomNum) >= 0) {
    return true     
  } else {
    return false
  }
}