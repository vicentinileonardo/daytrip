module.exports = app => {
  const forecasts = require("../controllers/forecast.controller.js");

  var router = require("express").Router();

  // Retrieve a single Destination with id
  router.get("/", forecasts.findOne);

  app.use("/api/forecasts", router);
};
