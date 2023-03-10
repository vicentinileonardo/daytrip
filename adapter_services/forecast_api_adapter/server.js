require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  let response = {
    "status": "success",
    "message": "Forecast API Adapter is up and running!",
    "data": null
  }
  return res.send(response);
});

// handle error 405 - method not allowed
app.all("/", function(req, res, next) {
  let response = {
    "status": "error",
    "code": 405,
    "message": "The requested method is not allowed for the URL."
  }
  res.status(405).send(response);
});

require("./app/routes/forecast.routes")(app);

// set port, listen for requests
if (process.env.NODE_ENV === 'production') {
  console.log("PRODUCTION MODE");
  const PORT = process.env.NODE_DOCKER_PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
} 
if (process.env.NODE_ENV === 'test') {
  console.log("TEST MODE");
  const PORT = process.env.TEST_DOCKER_PORT || 8081;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

module.exports = app;
