const fetch = require("node-fetch");

// Find a single crowd Forecast 
exports.findOne = async (req, res) => {

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

  if (!req.query.hour) {
    req.query.hour=12
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

  if (req.query.lon < -180 || req.query.lon > 180) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lon" : "lon must have a valid value (between -180 and 180)" }
    });
  }

  if (isNaN(req.query.lon)) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lon" : "lon must be a number" }
    });
  } 

  if (req.query.lat < -90 || req.query.lat > 90) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lat" : "lat must have a valid value (between -90 and 90)" }
    });
  } 

  if (isNaN(req.query.lat)) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lat" : "lat must be a number" }
    });
  } 

  if (req.query.hour < 0 || req.query.hour > 23) {
    return res.status(400).send({
      "status": "fail",
      "data": { "hour" : "hour must have a valid value (between 0 and 23)" }
    });
  } 

  if (isNaN(req.query.hour)) {
    return res.status(400).send({
      "status": "fail",
      "data": { "hour" : "hour must be a number" }
    });
  } 

  //recupero paramteri
  let lat = req.query.lat
  let lon = req.query.lon
  let hour = Math.round(req.query.hour)
  let date = req.query.date

  //FORECAST_RATING
  base_url="http://forecast_api_adapter:"
  port = process.env.FORECAST_API_ADAPTER_DOCKER_PORT || 8080;
  endpoint = "/api/forecasts/?"
  arguments_forecast = "lat=" + lat + "&" + "lon=" + lon + "&date=" + date

  url= base_url + port + endpoint + arguments_forecast

  external_response = await fetch(url);
  data = await external_response.json()

  //error management
  if (data["status"]=="error") {
    return res.status(400).send({
      "status": "error",
      "code": data["code"],
      "message": data["message"]
    });
  }
  if (data["status"]=="fail") {
    return res.status(400).send({
      "status": "fail",
      "data": data["data"]
    });
  }

  //computation forecast rating, each subrating is between 0 and 1, higher is better
  data = data["data"]["forecast"]["hour"][hour]

  temp_c_rating = 1-(Math.abs(data["temp_c"]-20)/30)  //20°C assumed as optimal temp

  chance_of_rain_rating = 1-(data["chance_of_rain"]/100)
  chance_of_snow_rating = 1-(data["chance_of_snow"]/100)

  wind_kph_rating = 1-(data["wind_kph"]/100) //100 kph assumed max wind speed possible

  if(temp_c_rating<0) temp_c_rating=0;
  if(wind_kph_rating<0) wind_kph_rating=0;

  const forecast_rating=(temp_c_rating+chance_of_rain_rating+chance_of_snow_rating+wind_kph_rating)/4
  const forecast_description=data["condition"]["text"]



  //CROWD_RATING
  base_url="http://crowd_api_adapter:"
  port = process.env.CROWD_API_ADAPTER_DOCKER_PORT || 8080;
  endpoint = "/api/crowds/?"
  arguments_crowd = "lat=" + lat + "&" + "lon=" + lon

  url = base_url + port + endpoint + arguments_crowd

  try {
    external_response = await fetch(url);
  } catch (error) {
    return res.status(500).send({
      "status": "error",
      "code": 500,
      "message": "Error in fetching data from crowd api adapter"
    });
  }

  data = await external_response.json()

  let crowd_rating = 0
  let crowd_description = ""
  
  if (data["status"]=="error" || data["status"]=="fail") {
    //do not take into account crowd rating
    crowd_rating = -1
    crowd_description = "Not available, " + (data["message"] ? data["message"] : data["data"])
  } else {
    data = data["data"]["crowd"]
    currentSpeed = data["currentSpeed"]
    freeFlowSpeed = data["freeFlowSpeed"]

    if(crowd_rating>=0.9) crowd_description="Not crowded"
    if(crowd_rating<0.9 && crowd_rating>=0.8) crowd_description="Slightly crowded"
    if(crowd_rating<0.80 && crowd_rating>=0.7) crowd_description="Crowded"
    if(crowd_rating<0.7) crowd_description="Very crowded"

    crowd_rating = 1-((freeFlowSpeed-currentSpeed)/freeFlowSpeed)
  }

  //AIR_POLLUTION_RATING
  base_url="http://air_pollution_api_adapter:";
  port = process.env.AIR_POLLUTION_API_ADAPTER_DOCKER_PORT || 8080;
  endpoint = "/api/air_pollution_info?";
  query_string = "lat=" + lat + "&lon=" + lon;

  url = base_url + port + endpoint + query_string

  try {
    external_response = await fetch(url);
  } catch (error) {
    return res.status(500).send({
      "status": "error",
      "code": 500,
      "message": "Error in fetching data from air pollution api adapter"
    });
  }

  data = await external_response.json()

  let air_pollution_rating = 0
  let air_pollution_description = ""
  
  if (data["status"]=="error" || data["status"]=="fail") {
    //do not take into account air pollution rating
    air_pollution_rating = -1
    air_pollution_description = "Not available, " + (data["message"] ? data["message"] : data["data"])
  } else {
    data = data["data"]["air_pollution_info"]
    aqi = data["aqi"]
    
    air_pollution_rating = 1-(aqi/5)
    console.log("air pollution rating", air_pollution_rating)

  }

  //weights
  forecast_weight = 0.87
  crowd_weight = 0.15
  air_pollution_weight = 0.03

  //final rating computation. after the computation the rating must be normalized between 0 and 1
  //check if the rating is available
  if(forecast_rating>=0 && crowd_rating>=0 && air_pollution_rating>=0) {
    final_rating = forecast_rating*forecast_weight + crowd_rating*crowd_weight + air_pollution_rating*air_pollution_weight
  } else if(forecast_rating>=0 && crowd_rating>=0 && air_pollution_rating<0) {
    //normalize weights
    forecast_weight = 0.9
    crowd_weight = 0.1
    final_rating = forecast_rating*forecast_weight + crowd_rating*crowd_weight
  } else if(forecast_rating>=0 && crowd_rating<0 && air_pollution_rating>=0) {
    //normalize weights
    forecast_weight = 0.95
    air_pollution_weight = 0.05
    final_rating = forecast_rating*forecast_weight + air_pollution_rating*air_pollution_weight
  } else if(forecast_rating>=0 && crowd_rating<0 && air_pollution_rating<0) {
    //normalize weights
    forecast_weight = 1
    final_rating = forecast_rating*forecast_weight
  } else {
    final_rating = -1
  }

  //response with check for errors
  res.status(200).send({
    "status": "success",
    "message": "Rating retrieved successfully",
    "data" : {
      "rating" :{
        "forecast_rating" : forecast_rating,
        "forecast_description" : forecast_description,
        "crowd_rating" : crowd_rating,
        "crowd_description" : crowd_description,
        "air_pollution_rating" : air_pollution_rating,
        "air_pollution_description" : air_pollution_description,
        "final_rating" : final_rating
      }
    }
  });
};
