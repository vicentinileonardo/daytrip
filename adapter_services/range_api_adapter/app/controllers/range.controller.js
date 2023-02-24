const fetch = require("node-fetch");

// Find a single Range
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

  if (req.query.lon < -180 || req.query.lon > 180) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lon" : "lon must have a valid value (between -180 and 180)" }
    });
  }

  if (req.query.lat < -90 || req.query.lat > 90) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lat" : "lat must have a valid value (between -90 and 90)" }
    });
  } 

  // Validate timeBudgetInSec format that must be a number
  if (req.query.timeBudgetInSec) {
    let timeBudgetInSec_regex = /^\d+$/
    if (!timeBudgetInSec_regex.test(req.query.timeBudgetInSec)) {
      return res.status(400).send({
        "status": "fail",
        "data": { "timeBudgetInSec" : "timeBudgetInSec must have a valid format (a positive integer)" }
      });
    }
  }

  //parameters
  let lat = req.query.lat
  let lon = req.query.lon

  //default value for timeBudgetInSec
  let timeBudgetInSec = req.query.timeBudgetInSec ? req.query.timeBudgetInSec : (12 * 60 * 60);
  
  //external API call
  let base_url = "https://api.tomtom.com/routing/1/calculateReachableRange/"
  let api_key = process.env.API_KEY
  let origin = lat + "," + lon
  let traffic = "true"
  
  let url = base_url + "/" + origin + "/json?" + "traffic=" + traffic + "&timeBudgetInSec=" + timeBudgetInSec + "&key=" + api_key 

  const external_response = await fetch(url);
  const data = await external_response.json();

  if (data["error"]) {
    let response = {
      "status": "error",
      "code": 500,
      "message": data["error"]["description"]
    }
    res.status(500).send(response);
    return;
  }
  
  //filtered_response
  let response = {
    "status": "success",
    "message": "Range retrieved successfully",
    "data": {
      "range": {
        "origin": {
            "lat": lat,
            "lon": lon
          },
        "boundary": data["reachableRange"]["boundary"]
      } 
    }
  }

  res.send(response);
  return;
};
