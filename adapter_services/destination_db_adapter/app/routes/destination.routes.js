module.exports = app => {
  const destinations = require("../controllers/destination.controller.js");

  var router = require("express").Router();

  //bulk import (ONLY FOR DEVELOPMENT)
  router.post("/bulk", verifyTokenAdmin, destinations.import);

  // Create a new Destination
  router.post("/", verifyTokenAdmin, destinations.create);

  // Retrieve all Destinations
  router.get("/", destinations.findAll);

  // Retrieve a single Destination with id
  router.get("/:id", destinations.findOne);

  // Update a Destination with id
  router.put("/:id", verifyTokenAdmin, destinations.update);
  router.put("/", destinations.update);

  // Delete a Destination with id
  router.delete("/:id", verifyTokenAdmin, destinations.delete);

  // Delete all destinations
  router.delete("/", verifyTokenAdmin, destinations.deleteAll);

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

function verifyTokenAdmin(req, res, next) {
  const jwt = require('jsonwebtoken');

  // Get auth header value
  const token = req.headers['authorization'];

  const SECRET_KEY = "MYKEY"

  if (!token) return res.status(401).send({
    "status": "fail",
    "code": 401,
    "data": {"authorization": "You need to be authenticated in order to access this method"}
  });
  try {
    const verified = jwt.verify(token, SECRET_KEY);
    if(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())["user"]["status"] == "ADMIN"){
      next();
    }else{
      return res.status(401).send({
        "status": "fail",
        "code": 401,
        "data": {"authorization": "You need to be an ADMIN in order to access this method"}
      })
    }
  } catch (err) {
    res.status(400).send({
      "status": "error",
      "code": 400,
      "message": "JWT error, "+err["message"]
    });
  }
}
