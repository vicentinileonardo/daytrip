
const fetch = require("node-fetch");

// Find a single Weather Forecast 
exports.findOne = async (req, res) => {
  
  //recupero paramteri
  let lat = req.query.lat
  let lon = req.query.lon
  let days = req.query.days
  let begin_hour = req.query.begin_hour
  let end_hour = req.query.end_hour


  //chiamata API esterna
  let base_url = "http://api.weatherapi.com/v1/forecast.json"
  let api_key = process.env.API_KEY
  let q = lat + "," + lon
  
  let url = base_url + "?key=" + api_key + "&q=" + q + "&days=" + days + "&alerts=no"

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);

  //logica interna nostra per confezionare la risposta
  let forecast = data.forecast.forecastday
  let forecast_filtered = []

  for (let i = 0; i < forecast.length; i++) {
    let day = forecast[i]
    let day_filtered = {
      date: day.date,
      day: day.day,
      hour: []
    }

    for (let j = 0; j < day.hour.length; j++) {
      let hour = day.hour[j]
      if (hour.time >= begin_hour && hour.time <= end_hour) {
        day_filtered.hour.push(hour)
      }
    }

    forecast_filtered.push(day_filtered)
  }

  //risposta
  res.send(forecast_filtered);



  //response with check for errors
  //res.send(data);


};




