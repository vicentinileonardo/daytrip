const fetch = require("node-fetch");

// Gets currentSpeed and freeFlowSpeed of a certain street
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

  //recupero paramteri
  let lat = req.query.lat //lat of the street considered
  let lon = req.query.lon //lon of the street considered

  //chiamata API esterna
  let base_url = "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json"
  let api_key = process.env.API_KEY
  let point = lat + "," + lon
  
  let url = base_url + "?key=" + api_key + "&point=" + point

  try {
    external_response = await fetch(url);
    data = await external_response.json();
  } catch (error) {
    data = {
      "status": "error",
      "code": 500,
      "message": "Error in fetching data from external API"
    }
  }

  if (data["error"]) {
    res.send({
        "status" : "error",
        "code": 500,
        "message" : data["error"]
      });
    return;
  }

  const currentSpeed=Number(data.flowSegmentData.currentSpeed)
  const freeFlowSpeed=Number(data.flowSegmentData.freeFlowSpeed)

  //response with check for errors
  res.status(200).send({
    "status" : "success",
    "message": "Crowd information retrieved successfully",
    "data" : {
      "crowd":{
        "currentSpeed":currentSpeed,
        "freeFlowSpeed":freeFlowSpeed
      }
    }
  });
};
