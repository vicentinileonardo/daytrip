module.exports = app => {
  const crowds = require("../controllers/crowd.controller.js");

  var router = require("express").Router();

  // Retrieve a Crowds informations related to a (lat,lon) couple
  router.get("/", crowds.findOne);

  app.use("/api/crowds", router);
};


