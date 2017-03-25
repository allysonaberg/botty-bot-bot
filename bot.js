 //REAL

 'use strict'

var Config = require('./config')
var wit = require('./wit').getWit()
var weather = require('openweather-node')
var YouTube = require('youtube-node')
var youTube = new YouTube()
module.exports = index
var index = require('./index')

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
  else if (message == 'YouTube') {

  message = 'searching with keyword "creepypasta"'
  youTube.search('creepypasta', 2, function(error, result) {
  if (error) {
    console.log(error);
  }
  else {

    console.log(JSON.stringify(result, null, 2));
    index.sendTextMessage(sender, message)
      }

    })
  //reply(sender, message)
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