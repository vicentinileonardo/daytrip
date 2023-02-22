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
    res.status(400).send({ message: "Destination must have a correct lon for coordinates (between -180 and 180)!" });
    return;
  }

  if (req.body.coordinates["lat"] < -90 || req.body.coordinates["lat"] > 90) {
    res.status(400).send({ message: "Destination must have a correct lat for coordinates (between -90 and 90)!" });
    return;
  } 

  // Create a Destination
  const destination = new Destination({
    name: req.body.name,
    description: req.body.description,
    image_url: req.body.image_url,
    coordinates: {
      lat:req.body.coordinates["lat"],
      lon:req.body.coordinates["lon"]
    }
  });

  // Save Destination in the database
  destination
    .save(destination)
    .then(data => {
      res.send(data);
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

// Update a Destination by the id in the request
exports.update = (req, res) => {
  
  // Validate request
  // check id
  if (!req.params.id) {
    return res.status(400).send({
      message: "Destination id can not be empty!"
    });
  }

  console.log("req.params: ", req.params);
  console.log("req.body: ", req.body);

  // check each field
  if (!req.body.name) {
    res.status(400).send({ message: "Destination to be updated must have a name!" });
    return;
  }

  if (!req.body.description) {
    res.status(400).send({ message: "Destination to be updated must have a description!" });
    return;
  }

  if (!req.body.image_url) {
    res.status(400).send({ message: "Destination to be updated must have an image_url!" });
    return;
  }

  if (!req.body.coordinates) {
    res.status(400).send({ message: "Destination to be updated must have coordinates!" });
    return;
  }

  if (!req.body.coordinates["lat"] || !req.body.coordinates["lon"]) {
    res.status(400).send({ message: "Destination to be updated must have both coordinates (lat and lon) !" });
    return;
  }

  if (req.body.coordinates["lon"] < -180 || req.body.coordinates["lon"] > 180) {
    res.status(400).send({ message: "Destination to be updated must have a correct lon for coordinates!" });
    return;
  }

  if (req.body.coordinates["lat"] < -90 || req.body.coordinates["lat"] > 90) {
    res.status(400).send({ message: "Destination to be updated must have a correct lat for coordinates!" });
    return;
  } 

  const id = req.params.id;

  Destination.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Destination with id=${id}. Maybe Destination was not found!`
        });
      } else res.send({ message: "Destination was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Destination with id=" + id
      });
    });
};

// Delete a Destination with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Destination.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Destination with id=${id}. Maybe Destination was not found!`
        });
      } else {
        res.send({
          message: "Destination was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Destination with id=" + id
      });
    });
};

// Delete all Destinations from the database.
exports.deleteAll = (req, res) => {

  Destination.deleteMany()
    .then(data => {
      res.send({
        message: `${data.deletedCount} Destinations were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all the destinations."
      });
    });
};



