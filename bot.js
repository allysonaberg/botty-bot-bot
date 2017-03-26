 //REAL

 'use strict'

var Config = require('./config')
var wit = require('./wit').getWit()
var weather = require('openweather-node')
var YouTube = require('youtube-node')
var youTube = new YouTube()
youTube.setKey('AIzaSyDxvDFk1sS41kxhWS8YR5etEGlHfkrExrI')



//WEATHER 
weather.setAPPID("d72d8e533ae9c657e21baee780140f76");
//set the culture 
weather.setCulture("en");
//set the forecast type 
weather.setForecastType("daily"); //or "" for 3 hours forecast 

// LETS SAVE USER SESSIONS
var sessions = {}

var findOrCreateSession = function (fbid) {
  var sessionId

  // DOES USER SESSION ALREADY EXIST?
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // YUP
      sessionId = k
    }
  })

  // No session so we will create one
  if (!sessionId) {
    sessionId = new Date().toISOString()
    sessions[sessionId] = {
      fbid: fbid,
      context: {
        _fbid_: fbid
      }
    }
  }

  return sessionId
}

var read = function (sender, message, reply) {
  if (message =='Hello') {
    // Let's reply back hello
    message = 'Hello yourself! I am a chat bot. You can say "show me pics of corgis"'
    reply(sender, message)
  } 
  //YOUTUBE WORKING FOR FIXED KEYWORD SEARCH
  else if (message == 'Youtube') {

  message = 'searching with keyword "creepypasta"'
  youTube.search('creepypasta', 2, function(error, result) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(JSON.stringify(result, null, 2));
    //reply(sender, message)
      }

    })
  //reply(sender, message)
  sendTextMessage(sender, message)
  }
    else {
    // Let's find the user
    var sessionId = findOrCreateSession(sender)
    // Let's forward the message to the Wit.ai bot engine
    // This will run all actions until there are no more actions left to do
    wit.runActions(
      sessionId, // the user's current session by id
      message,  // the user's message
      sessions[sessionId].context, // the user's session state
      function (error, context) { // callback
      if (error) {
        console.log('oops!', error)
      } else {
        // Wit.ai ran all the actions
        // Now it needs more messages
        console.log('Waiting for further messages')

        // Based on the session state, you might want to reset the session
        // Example:
        // if (context['done']) {
        //  delete sessions[sessionId]
        // }

        // Updating the user's current session state
        sessions[sessionId].context = context
      }
    })
  }
}



module.exports = {
  findOrCreateSession: findOrCreateSession,
  read: read,
}




/****** ADDED IN ******/

'use strict'

//setting up node_modules
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var weather = require('openweather-node')


//setting up file requirements
var Config = require('./config')
var FB = require('./facebook')
var Bot = require('./bot')



//server
var app = express()
app.set('port', (process.env.PORT) || 5000)
// SPIN UP SERVER
app.listen(app.get('port'), function () {
  console.log('Running on port', app.get('port'))
})
// PARSE THE BODY
app.use(bodyParser.json())

//WEATHER 
weather.setAPPID("d72d8e533ae9c657e21baee780140f76");
//set the culture 
weather.setCulture("en");
//set the forecast type 
weather.setForecastType("daily"); //or "" for 3 hours forecast 


// index page
app.get('/', function (req, res) {
  res.send('hello world i am a chat bot')
})

// for facebook to verify
app.get('/webhooks', function (req, res) {
  if (req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})

// to send messages to facebook
app.post('/webhooks', function (req, res) {
  var entry = FB.getMessageEntry(req.body)
  // checking for a valid message
  if (entry && entry.message) {
    if (entry.message.attachments) {
      //can't identify attachments yet though
      FB.newMessage(entry.sender.id, "That's interesting!")
    } else {
      //bot will execute the "read" function
      Bot.read(entry.sender.id, entry.message.text, function (sender, reply) {
        FB.newMessage(sender, reply)
      })
    }
  }

  res.sendStatus(200)
})

//send text function
function sendTextMessage(sender, text) {
    let messageData = { text:text } //message data is a variable that holds the text
    //setting up our requet query
    sendRequest(sender, messageData)
}


function sendRequest(sender, messageData) {
request({
        url: 'https://graph.facebook.com/v2.6/me/messages',//url to send request to
        qs: {access_token:token}, //our given access token
        method: 'POST', 
        json: { //what will be sent in the request
            recipient: {id: sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}