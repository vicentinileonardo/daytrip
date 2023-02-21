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

  app.use("/api/users", router);
};
