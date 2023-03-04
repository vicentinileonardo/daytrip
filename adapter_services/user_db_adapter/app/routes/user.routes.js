module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  //bulk import (ONLY FOR DEVELOPMENT)
  router.post("/bulk", users.import);

  // Create a new User
  router.post("/", users.create);

  // Retrieve all User
  router.get("/", users.findAll);

  // Retrieve a single User with id
  router.get("/:id", users.findOne);

  // Update a User with id
  router.put("/", users.update);
  router.put("/:id", users.update);
  
  // Delete a User with id
  router.delete("/:id", users.delete);

  // Delete all Users
  router.delete("/", users.deleteAll);

  // Retrieve a single User with id
  router.get("/email/:email", users.findByEmail);


  // handle error 405 - method not allowed
  router.all("/", function(req, res, next) {
    let response = {
      "status": "error",
      "code": 405,
      "message": "The requested method is not allowed for the URL."
    }
    res.status(405).send(response);
  });

  app.use("/api/users", router);

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
