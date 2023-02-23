
const fetch = require("node-fetch");

// Find a single crowd Forecast 
exports.findOne = async (req, res) => {

  if (!req.query.lat) {
    res.status(400).send({ message: "Crowd request must have lat!" });
    return;
  }

  if (!req.query.lon) {
    res.status(400).send({ message: "Crowd request must have lon!" });
    return;
  }

  if (req.query.lon < -180 || req.query.lon > 180) {
    res.status(400).send({ message: "Crowd request must have a correct lon for origin coordinates!" });
    return;
  }

  if (req.query.lat < -90 || req.query.lat > 90) {
    res.status(400).send({ message: "Crowd request must have a correct lat for origin coordinates!" });
    return;
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

  const currentSpeed=Number(data.flowSegmentData.currentSpeed)
  const freeFlowSpeed=Number(data.flowSegmentData.freeFlowSpeed)

  //crowdedRate, value between 0 and 1, higher is better
  const crowdedRate=1-((freeFlowSpeed-currentSpeed)/freeFlowSpeed)
  //risposta
  newResponseString='{"crowdedRate":'+crowdedRate+',"currentSpeed":'+currentSpeed+',"freeFlowSpeed":'+freeFlowSpeed+'}'


  //response with check for errors
  res.send(newResponseString);
};




