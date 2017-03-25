'use strict'

//setting up dependencies
var Config = require('./config')
var FB = require('./facebook')
var Wit = require('node-wit').Wit
var request = require('request')
//var weather = require('openweather-node')
var weather = require('oepnweather-apis')

//WEATHER API setup 
// weather.setAPPID("d72d8e533ae9c657e21baee780140f76");
// weather.setCulture("en");
// weather.setForecastType("daily"); //or "" for 3 hours forecast 
weather.setAPPID("d72d8e533ae9c657e21baee780140f76");
weather.setLang('en');
weather.setUnits('metric');



//a helper function to return the value of the first entity (variable that goes with intent: for weather, entity = TORONTO)
//called inside merge 
var firstEntityValue = function (entities, entity) {
	var val = entities && entities[entity] &&
		Array.isArray(entities[entity]) &&
		entities[entity].length > 0 &&
		entities[entity][0].value

	if (!val) {
		return null
	}
	return typeof val === 'object' ? val.value : val
}


//actions, all the things that wit.ai can do
var actions = {
	say (sessionId, context, message, cb) {
		// Bot testing mode, run cb() and return
		if (require.main === module) {
			cb()
			return
		}
		console.log('WIT WANTS TO TALK TO:', context._fbid_)
		console.log('WIT HAS SOMETHING TO SAY:', message)
		console.log('WIT HAS A CONTEXT:', context.loc)

		if (checkURL(message)) {
			FB.newMessage(context._fbid_, message, true)
		} else {
			FB.newMessage(context._fbid_, message)
		}
		cb()
	},


	merge(sessionId, context, entities, message, cb) {
		// Reset the weather story
		delete context.forecast
		// Retrive the location entity and store it in the context field
		var loc = firstEntityValue(entities, 'location') //calls the entity helper function to get location
		console.log("LOCATION: " + loc)
		if (loc) {
			context.loc = loc
		}
		else {
			context.weather = 'Sorry, I didnt get that'
			cb(context)
		}
		// Reset the cutepics story
		delete context.pics
		// Retrieve the category
		var category = firstEntityValue(entities, 'category')
		if (category) {
			context.cat = category
		}
		// Retrieve the sentiment
		var sentiment = firstEntityValue(entities, 'sentiment')
		if (sentiment) {
			context.ack = sentiment === 'positive' ? 'Glad your liked it!' : 'Aww, that sucks.'
		} else {
			delete context.ack
		}
		cb(context)
	},

	error(sessionId, context, error) {
		console.log(error.message)
	},
	//list of functions it can execute
	['fetch-pics'](sessionId, context, cb) {
		var wantedPics = allPics[context.cat || 'default']
		context.pics = wantedPics[Math.floor(Math.random() * wantedPics.length)]

		cb(context)
	},
	['fetch-weather'](sessionId, context, cb) { //cb == callback
	 //openweather-node api call
      // weather.now(context.loc,function(err, aData)
      // { 
      //     if(err) {
      //     console.log(err);
      //     let message = "sorry, I don't understand"
      //     context.forecast = message
      //     cb(context)
      //     delete context.forecast
      // 	}
      //     else
      //     {
      //         let text =  aData.getDegreeTemp()
      //         let min = text.temp_min
      //         let max = text.temp_max
      //         let message = "Today is a high of " + max + " and a low of " + min 
      //         context.forecast = message;
      //         cb(context);
      //         delete context.forecast

      //     }
      // })

	//openweathermap api call
	weather.setCity(context.loc)
		let text = weather.getTemperature(function(err, temp) {
			console.log(temp)
			context.forecast = "weather is logged"
			cb(context)
		})

  },

}

// setup wit
var getWit = function () {
	console.log('GRABBING WIT')
	return new Wit(Config.WIT_TOKEN, actions)
}

module.exports = {
	getWit: getWit,
}

// BOT TESTING MODE
if (require.main === module) {
	console.log('Bot testing mode!')
	var client = getWit()
	client.interactive()
}

// GET WEATHER FROM API
// var getWeather = function (location) {
// 	return new Promise(function (resolve, reject) {
// 		var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+ location +'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
// 		request(url, function (error, response, body) {
// 		    if (!error && response.statusCode == 200) {
// 		    	var jsonData = JSON.parse(body)
// 		    	var forecast = jsonData.query.results.channel.item.forecast[0].text
// 		      console.log('WEATHER API SAYS....', jsonData.query.results.channel.item.forecast[0].text)
// 		      return forecast
// 		    }
// 			})
// 	})
// }

// CHECK IF URL IS AN IMAGE FILE
var checkURL = function (url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

// LIST OF ALL PICS
var allPics = {
  corgis: [
    'http://i.imgur.com/uYyICl0.jpeg',
    'http://i.imgur.com/useIJl6.jpeg',
    'http://i.imgur.com/LD242xr.jpeg',
    'http://i.imgur.com/Q7vn2vS.jpeg',
    'http://i.imgur.com/ZTmF9jm.jpeg',
    'http://i.imgur.com/jJlWH6x.jpeg',
		'http://i.imgur.com/ZYUakqg.jpeg',
		'http://i.imgur.com/RxoU9o9.jpeg',
  ],
  racoons: [
    'http://i.imgur.com/zCC3npm.jpeg',
    'http://i.imgur.com/OvxavBY.jpeg',
    'http://i.imgur.com/Z6oAGRu.jpeg',
		'http://i.imgur.com/uAlg8Hl.jpeg',
		'http://i.imgur.com/q0O0xYm.jpeg',
		'http://i.imgur.com/BrhxR5a.jpeg',
		'http://i.imgur.com/05hlAWU.jpeg',
		'http://i.imgur.com/HAeMnSq.jpeg',
  ],
  default: [
    'http://blog.uprinting.com/wp-content/uploads/2011/09/Cute-Baby-Pictures-29.jpg',
  ],
};
