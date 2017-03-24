

//BOT APP
'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const Wit = require('node-wit').Wit;
const FB = require('./connectors/facebook');
const Config = require('./config.js');
const weather = require('openweather-node')


//WEATHER 
weather.setAPPID("d72d8e533ae9c657e21baee780140f76");
//set the culture 
weather.setCulture("en");
//set the forecast type 
weather.setForecastType("daily"); //or "" for 3 hours forecast 

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

// Bot actions
const actions = {
  say(sessionId, context, message, cb) {
    console.log(message);

    // Bot testing mode, run cb() and return
    if (require.main === module) {
      cb();
      return;
    }

    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to from context
    // TODO: need to get Facebook user name
    const recipientId = context._fbid_;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      FB.fbMessage(recipientId, message, (err, data) => {
        if (err) {
          console.log(
            'Oops! An error occurred while forwarding the response to',
            recipientId,
            ':',
            err
          );
        }

        // Let's give the wheel back to our bot
        cb();
      });
    } else {
      console.log('Oops! Couldn\'t find user in context:', context);
      // Giving the wheel back to our bot
      cb();
    }
  },
  merge(sessionId, context, entities, message, cb) {
    // Retrieve the location entity and store it into a context field
    const loc = firstEntityValue(entities, 'location');
    if (loc) {
      context.loc = loc; // store it in context
    }

    cb(context);
  },

  error(sessionId, context, error) {
    console.log(error.message);
  },

  // fetch-weather bot executes
  ['fetch-weather'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
      weather.now("Toronto",function(err, aData)
      { 
          if(err) console.log(err);
          else
          {
              let text =  aData.getDegreeTemp()
              let min = text.temp_min
              let max = text.temp_max
              let message = "Today is a high of " + max + " and a low of " + min + "."
              context.forecast = message;
              cb(context);
          }
      })

  },
};

var read = function (sender, message, reply) {
  if (message =='Hello') {
    // Let's reply back hello
    message = 'Hello yourself! I am a chat bot. You can say "show me pics of corgis"'
    reply(sender, message)
  } else {
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

const getWit = () => {
  return new Wit(Config.WIT_TOKEN, actions);
};

exports.getWit = getWit;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  console.log("Bot testing mode.");
  const client = getWit();
  client.interactive();
}