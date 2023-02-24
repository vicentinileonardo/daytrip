
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

  //recupero paramteri
  let lat = req.query.lat
  let lon = req.query.lon

  //chiamata API esterna
  let base_url = "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json"
  let api_key = process.env.API_KEY
  let point = lat + "," + lon
  
  let url = base_url + "?key=" + api_key + "&point=" + point

  const response = await fetch(url);
  const data = await response.json();

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

  //crowdedRate, value between 0 and 1, higher is better
  const crowdedRate=1-((freeFlowSpeed-currentSpeed)/freeFlowSpeed)

  //response with check for errors
  res.status(200).send({
    "status" : "success",
    "data" : {
      "crowd":{
        "currentSpeed":currentSpeed,
        "freeFlowSpeed":freeFlowSpeed
      }
    }
  });
};




