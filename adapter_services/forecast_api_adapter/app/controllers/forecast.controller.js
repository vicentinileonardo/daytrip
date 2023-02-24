const fetch = require("node-fetch");

// Find a single Weather Forecast 
exports.findOne = async (req, res) => {
  
  // Validate request
  if (!req.query.lat) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lat" : "lat is required" }
    });
  }

  if (!req.query.lon) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lon" : "lon is required" }
    });
  }

  if (req.query.lat < -90 || req.query.lat > 90) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lat" : "lat must have a valid value (between -90 and 90)" }
    });
  } 

  if (req.query.lon < -180 || req.query.lon > 180) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lon" : "lon must have a valid value (between -180 and 180)" }
    });
  }

  if (!req.query.date) {
    return res.status(400).send({
      "status": "fail",
      "data": { "date" : "date is required" }
    });
  }

  // Validate date format that must be YYYY-MM-DD
  let date_regex = /^\d{4}-\d{2}-\d{2}$/
  if (!date_regex.test(req.query.date)) {
    return res.status(400).send({
      "status": "fail",
      "data": { "date" : "date must have a valid format (YYYY-MM-DD)" }
    });
  }

  //date should be between today and next 14 days
  let queryDate = new Date(req.query.date);
  let today = new Date();
  today.setHours(0,0,0,0); //in order include today
  let next_14_days = new Date();
  next_14_days.setDate(today.getDate() + 14);
  
  if (queryDate < today || queryDate > next_14_days) {
    return res.status(400).send({
      "status": "fail",
      "data": { "date" : "date must be between today and next 14 days" }
    });
  }
  
  // Validate begin_hour and end_hour
  if (req.query.begin_hour && (req.query.begin_hour < 0 || req.query.begin_hour > 23)) {
    return res.status(400).send({
      "status": "fail",
      "data": { "begin_hour" : "begin_hour must have a valid value (between 0 and 23)" }
    });
  }

  if (req.query.end_hour && (req.query.end_hour < 0 || req.query.end_hour > 23)) {
    return res.status(400).send({
      "status": "fail",
      "data": { "end_hour" : "end_hour must have a valid value (between 0 and 23)" }
    });
  }

  //parameters
  let lat = req.query.lat
  let lon = req.query.lon
  let date = req.query.date
  let days = 1
  let begin_hour = req.query.begin_hour ? req.query.begin_hour : 0
  let end_hour = req.query.end_hour ? req.query.end_hour : 23

  //external api call
  let base_url = "http://api.weatherapi.com/v1/forecast.json"
  let api_key = process.env.API_KEY
  let q = lat + "," + lon
  
  let url = base_url + "?key=" + api_key + "&q=" + q + "&dt=" + date + "&days=" + days + "&alerts=no"

  const external_response = await fetch(url);
  if (external_response.status != 200) {
    let response = {
      status: "error",
      code: external_response.status ? external_response.status : 500,
      message: external_response.statusText ? external_response.statusText : "Error while retrieving forecast",
    }
    return res.send(response);
  }

  const data = await external_response.json();

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

  let response = {
    status: "success",
    message: "Forecast retrieved successfully",
    data: {forecast: forecast_filtered[0]} //forecast_filtered is an array of length 1, if we keep days = 1
  }

  res.send(response);
  return;
};
