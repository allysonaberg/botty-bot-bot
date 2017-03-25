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
global.sendTextMessage = function sendTextMessage(sender, text) {
    let messageData = { text:text } //message data is a variable that holds the text
    //setting up our request query
    sendRequest(sender, messageData)
}


function sendRequest(sender, messageData) {
request({
        url: 'https://graph.facebook.com/v2.6/me/messages',//url to send request to
        qs: {access_token: process.env.FB_PAGE_TOKEN, //our given access token
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
    }
})


