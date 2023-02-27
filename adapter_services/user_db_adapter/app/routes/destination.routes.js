module.exports = app => {
  const destinations = require("../controllers/destination.controller.js");

  var router = require("express").Router();

  //bulk import (ONLY FOR DEVELOPMENT)
  router.post("/bulk", destinations.import);

  // Create a new Destination
  router.post("/", destinations.create);

  // Retrieve all Destinations
  router.get("/", destinations.findAll);

  // Retrieve a single Destination with id
  router.get("/:id", destinations.findOne);

  // Update a Destination with id
  router.put("/:id", destinations.update);
  router.put("/", destinations.update);

  // Delete a Destination with id
  router.delete("/:id", destinations.delete);

  // Delete all destinations
  router.delete("/", destinations.deleteAll);

  // handle error 405 - method not allowed
  router.all("/", function(req, res, next) {
    let response = {
      "status": "error",
      "code": 405,
      "message": "The requested method is not allowed for the URL."
    }
    res.status(405).send(response);
  });

  app.use("/api/destinations", router);
  
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
