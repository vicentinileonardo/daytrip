module.exports = app => {
  const weathers = require("../controllers/weather.controller.js");

  var router = require("express").Router();

  // Retrieve a single Destination with id
  router.get("/", weathers.findOne);

  app.use("/api/weathers", router);
};
