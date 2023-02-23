module.exports = app => {
  const ranges = require("../controllers/range.controller.js");

  var router = require("express").Router();

  // Retrieve a Ranges informations related to a (lat,lon) couple
  router.get("/", ranges.findOne);

  app.use("/api/ranges", router);

  //handle 404
  app.use(function(req, res, next) {
    res.status(404).send('Error 404, not found!');
  });
};


