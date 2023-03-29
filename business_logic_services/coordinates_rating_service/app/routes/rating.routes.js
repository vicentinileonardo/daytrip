module.exports = app => {
  const ratings = require("../controllers/rating.controller.js");

  var router = require("express").Router();

  //  Gets a rating associated on how much a place could be enjoyable taking into account the weather info, the traffic and the air quality
  router.get("/", ratings.findOne);

  // handle error 405 - method not allowed
  router.all("/", function(req, res, next) {
    let response = {
      "status": "error",
      "code": 405,
      "message": "The requested method is not allowed for the URL."
    }
    res.status(405).send(response);
  });

  app.use("/api/v1/ratings", router);
  
  //handle 404
  app.use(function(req, res, next) {
    let response = {
      "status": "error",
      "code": 404,
      "message": "The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again."
    }
    res.status(404).send(response);
  });
};


