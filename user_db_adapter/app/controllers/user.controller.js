const db = require("../models");
const User = db.users;

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "User must have a name!" });
    return;
  }

  if (!req.body.surname) {
    res.status(400).send({ message: "User must have a surname!" });
    return;
  }

  if (!req.body.email) {
    res.status(400).send({ message: "User must have an email!" });
    return;
  }

  if (!req.body.password) {
    res.status(400).send({ message: "User must have a password!" });
    return;
  }
 
  // Create a User
  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password
  });

  // Save Tutorial in the database
  user
    .save(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  
  // TODO: Add pagination
  // TODO: change condition
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  User.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving User with id=" + id });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  
  // Validate request
  // check id
  if (!req.params.id) {
    return res.status(400).send({
      message: "User id can not be empty!"
    });
  }

  console.log("req.params: ", req.params);
  console.log("req.body: ", req.body);

  // check each field
  if (!req.body.name) {
    res.status(400).send({ message: "User to be updated must have a name!" });
    return;
  }

  if (!req.body.surname) {
    res.status(400).send({ message: "User to be updated must have a surname!" });
    return;
  }

  if (!req.body.email) {
    res.status(400).send({ message: "User to be updated must have an email!" });
    return;
  }

  if (!req.body.password) {
    res.status(400).send({ message: "User to be updated must have a password!" });
    return;
  }

  if (!req.body.status) {
    res.status(400).send({ message: "User to be updated must have a status!" });
    return;
  }

  if (!req.body.origin_name) {
    res.status(400).send({ message: "User to be updated must have an origin name!" });
    return;
  }

  if (!req.body.origin_coordinates) {
    res.status(400).send({ message: "User to be updated must have origin coordinates!" });
    return;
  }

  if (!req.body.origin_coordinates["lat"] || !req.body.origin_coordinates["lon"]) {
    res.status(400).send({ message: "User to be updated must have both origin coordinates (lat and lon) !" });
    return;
  }

  if (req.body.origin_coordinates["lon"] < -180 || req.body.origin_coordinates["lon"] > 180) {
    res.status(400).send({ message: "User to be updated must have a correct lon for origin coordinates!" });
    return;
  }

  if (req.body.origin_coordinates["lat"] < -90 || req.body.origin_coordinates["lat"] > 90) {
    res.status(400).send({ message: "User to be updated must have a correct lat for origin coordinates!" });
    return;
  } 

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      } else {
        res.send({
          message: "User was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {

  // condition to delete only STANDARD or ADMIN users if provided in the request query
  const role = req.query.role;
  let condition = role ? { role: role } : {};

  User.deleteMany(condition)
    .then(data => {
      res.send({
        message: `${data.deletedCount} Users were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};

// specific query
/*
// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Tutorial.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
*/

