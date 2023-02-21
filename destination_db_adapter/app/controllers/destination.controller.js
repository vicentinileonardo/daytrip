const db = require("../models");
const Destination = db.destinations;

// Create and Save a new Destination
exports.create = (req, res) => {

  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Destination must have a name!" });
    return;
  }

  if (!req.body.description) {
    res.status(400).send({ message: "Destination must have a description!" });
    return;
  }

  if (!req.body.image_url) {
    res.status(400).send({ message: "Destination must have a image URL!" });
    return;
  }

  if (!req.body.coordinates) {
    res.status(400).send({ message: "Destination must have coordinates!" });
    return;
  }

  if (!req.body.coordinates["lat"] || !req.body.coordinates["lon"]) {
    res.status(400).send({ message: "Destination must have both coordinates (lat and lon) !" });
    return;
  }

  if (req.body.coordinates["lon"] < -180 || req.body.coordinates["lon"] > 180) {
    res.status(400).send({ message: "Destination must have a correct lon for coordinates!" });
    return;
  }

  if (req.body.origin_coordinates["lat"] < -90 || req.body.origin_coordinates["lat"] > 90) {
    res.status(400).send({ message: "Destination must have a correct lat for coordinates!" });
    return;
  } 

  // Create a Destination
  const destination = new Destination({
    name: req.body.name,
    description: req.body.description,
    origin_name: req.body.origin_name,
    coordinates: {
      lat:req.body.coordinates["lat"],
      lon:req.body.coordinates["lon"]
    }
  });

  // Save Destination in the database
  destination
    .save(destination)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Destination."
      });
    });
};

// Retrieve all Destinations from the database.
exports.findAll = (req, res) => {
  
  //Add pagination
  const paginationOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 10
  }

  Destination.find({})
    .skip(paginationOptions.page * paginationOptions.limit)
    .limit(paginationOptions.limit)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving destinations."
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Destination.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Destination with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Destination with id=" + id });
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

