                                                                                     
//             (      (   (                                        (              )    )         
//             )\     )\  )\ (                         )       )   )\ )   (    ( /( ( /( (       
//          ((((_)(  ((_)((_))\ )  (    (    (        (     ( /(  (()/(  ))\   )\()))\()))\  (   
//           )\ _ )\  _   _ (()/(  )\   )\   )\ )     )\  ' )(_))  ((_))/((_) (_))/((_)\((_) )\  
//           (_)_\(_)| | | | )(_))((_) ((_) _(_/(   _((_)) ((_)_   _| |(_))   | |_ | |(_)(_)((_) 
//            / _ \  | | | || || |(_-</ _ \| ' \)) | '  \()/ _` |/ _` |/ -_)  |  _|| ' \ | |(_-< 
//           /_/ \_\ |_| |_| \_, |/__/\___/|_||_|  |_|_|_| \__,_|\__,_|\___|   \__||_||_||_|/__/ 
//                           |__/                                                               

'use strict'

//DEPENDENCIES
const express = require('express') //node framework to easily write backend code
const bodyParser = require('body-parser')
const request = require('request')
const weather = require('openweather-node')
//initializing app as express application
const app = express()

//const FB = require('./facebook.js')



//setting port, there may already be a port set for this type of application
app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
// Process json
app.use(bodyParser.json())


//WEATHER 
weather.setAPPID("d72d8e533ae9c657e21baee780140f76");
//set the culture 
weather.setCulture("en");
//set the forecast type 
weather.setForecastType("daily"); //or "" for 3 hours forecast 
//ROUTES

// Index route
//general app url
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
//verifying the word token given and the webhook
//allowing user to use the application, like a password
//where req=request
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'allyson') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})


// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

//API CALLS AND GENERAL CODE ***************************************************************************

//webhook API call
//what the application will return, req = request, res = response
  app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging //messaging events = array of messages
    for (let i = 0; i < messaging_events.length; i++) { //iterates through messages
      let event = req.body.entry[0].messaging[i] //where event = a single message
      let sender = event.sender.id //sender
      if (event.message && event.message.text) { //if there is a message and that message has text, then do something
        let text = event.message.text //saves text sent by user
        //sendTextMessage(sender, text)
          decideMessage(sender, text)

      }
    }
    res.sendStatus(200)
  })

const token = "EAAPRFhieu38BABxloWXRFcv51PGIq2rNm3s4DsyDISzysc7pgSaoFyR7nZBdyWBHhPZCQ6PE6hOPWEogi1BRBlMqCSGmZCrByHff3ZBix9QIYtAJHr3S9emN13FEtcT7gXTEQTMOHZC7aSLClH93EVd8sgmZBT37C4gqDk5Dz1sgZDZD"

//send text function
function sendTextMessage(sender, text) {
    let messageData = { text:text } //message data is a variable that holds the text
    //setting up our requet query
    sendRequest(sender, messageData)
}

function decideMessage(sender, text1) {
    let text = text1.toLowerCase()//all input is not same format
    if (text.includes("index")) {
        sendIndex(sender)
    }else if (text.includes("weather")) {
      sendWeatherMessage(sender)
    }else if (text.includes("add")) {
      sendTextMessage(sender, "What would you like to add?")
      
    }

     else {
        sendTextMessage(sender, "Hello, how are you?")
        //send follow up question
    }
}

function sendButtonMessage( sender, text) {
    let messageData = {
        "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text": text,
        "buttons":[
          {
            "type":"postback",
            "title":"Summer",
            "payload": "summer" //PAYLOAD = WHAT GETS "RETURNED"
          },
          {
            "type":"postback",
            "title":"Winter",
            "payload":"Winter"
          }
        ]
      }
    }
}
sendRequest(sender, messageData)
}

function sendIndex(sender) {
      let messageData = {
        "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text": "",
        "buttons":[
          {
            "type":"postback",
            "title":"Notes",
            "payload": "notes" //PAYLOAD = WHAT GETS "RETURNED"
          },
          {
            "type":"postback",
            "title":"Agenda",
            "payload":"ageda"
          },
          {
            "type":"postback",
            "title":"Articles",
            "payload":"articles"
          },
          {
            "type":"postback",
            "title":"Reminders",
            "payload":"reminders"
          }
        ]
      }
    }
  }
}

function sendWeatherMessage(sender) {
      weather.now("Toronto",function(err, aData)
      { 
          if(err) console.log(err);
          else
          {
              let text =  aData.getDegreeTemp()
              let min = text.temp_min
              let max = text.temp_max
              let message = "Today is a high of " + max + " and a low of " + min + "."
              sendTextMessage(sender, message)
          }
      })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"I love winter",
            "image_url":"https://petersfancyapparel.com",
            "subtitle":"I love winter",
            "default_action": {
              "type": "web_url",
              "url": "https://petersfancyapparel.com",
              "messenger_extensions": true,
              "webview_height_ratio": "tall",
              "fallback_url": "https://petersfancyapparel.com"
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://petersfancyapparel.com",
                "title":"View Website"
              }             
            ]      
          }
        ]
      }
    }
    }

sendRequest(sender, messageData)
}

// function addToList(sender, item) {
//   arrayList.push(item)
//   for (int i = 0; i < arrayList.length; i++) {
//   sendTextMessage(sender, arrayList[i])
// }
// }
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

                                                                                     

