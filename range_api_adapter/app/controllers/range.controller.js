const fetch = require("node-fetch");

// Find a single crowd Forecast 
exports.findOne = async (req, res) => {

  if (!req.query.lat) {
    res.status(400).send({ message: "Range request must have lat!" });
    return;
  }

  if (!req.query.lon) {
    res.status(400).send({ message: "Range request must have lon!" });
    return;
  }

  if (req.query.lon < -180 || req.query.lon > 180) {
    res.status(400).send({ message: "Range request must have a correct lon for origin coordinates!" });
    return;
  }

  if (req.query.lat < -90 || req.query.lat > 90) {
    res.status(400).send({ message: "Range request must have a correct lat for origin coordinates!" });
    return;
  } 
  
  //recupero parametri
  let lat = req.query.lat
  let lon = req.query.lon

  //ternary operator, time
  let timeBudgetInSec = req.query.timeBudgetInSec ? req.query.timeBudgetInSec : (12 * 60 * 60);
  
  //chiamata API esterna
  let base_url = "https://api.tomtom.com/routing/1/calculateReachableRange/"
  let api_key = process.env.API_KEY
  let origin = lat + "," + lon
  let traffic = "true"
  
  let url = base_url + "/" + origin + "/json?" + "traffic=" + traffic + "&timeBudgetInSec=" + timeBudgetInSec + "&key=" + api_key 

  const response = await fetch(url);
  const data = await response.json();

  if (data["error"]) {
    res.status(400).send({ message: data["error"]["description"] });
    return;
  }
  
  //filtered_response
  filtered_response = {
    range: {
      origin: {
        lat: lat,
        lon: lon
      },
      boundary: data["reachableRange"]["boundary"]
    } 
  }

  filtered_response = JSON.stringify(filtered_response);
  
  //response with check for errors
  res.send(filtered_response);
};




