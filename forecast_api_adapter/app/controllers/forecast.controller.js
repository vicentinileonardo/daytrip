const fetch = require("node-fetch");

// Find a single Weather Forecast 
exports.findOne = async (req, res) => {
  
  // Validate request
  if (!req.query.lat) {
    return res.status(400).send({
      message: "Forecast lat can not be empty!"
    });
  }

  if (!req.query.lon) {
    return res.status(400).send({
      message: "Forecast lon can not be empty!"
    });
  }

  //parameters
  let lat = req.query.lat
  let lon = req.query.lon
  let days = 1
  let begin_hour = req.query.begin_hour ? req.query.begin_hour : 0
  let end_hour = req.query.end_hour ? req.query.end_hour : 23

  //external api call
  let base_url = "http://api.weatherapi.com/v1/forecast.json"
  let api_key = process.env.API_KEY
  let q = lat + "," + lon
  
  let url = base_url + "?key=" + api_key + "&q=" + q + "&days=" + days + "&alerts=no"

  const response = await fetch(url);
  const data = await response.json();

  //filtering
  let forecast = data.forecast.forecastday
  let forecast_filtered = []

  for (let i = 0; i < forecast.length; i++) { //length = 1 always, if we keep days = 1
    let day = forecast[i]
    
    let day_filtered = {
      date: day.date,
      day: day.day,
      hour: []
    }

    for (let j = 0; j < day.hour.length; j++) { //length = 24 always
      let hour = day.hour[j]

      //hour.time is a string like "2021-03-01 00:00" and we want to filter only the hours
      hour.time = hour.time.split(" ")[1].split(":")[0]
      
      if (hour.time == "00") {
        hour.time = "0"
      }
      hour.time = parseInt(hour.time)
      
      if (hour.time >= begin_hour && hour.time <= end_hour) {
        day_filtered.hour.push(hour)
      }
    }

    forecast_filtered.push(day_filtered)
  }

  //response with check for errors
  res.send(forecast_filtered);

};
