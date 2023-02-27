const db = require("../models");
const Destination = db.destinations;

// Create and Save a new Destination
exports.create = (req, res) => {

  // Validate request
  if (!req.body.name) {
    return res.status(400).send({
      "status": "fail",
      "data": { "name" : "name is required" }
    });
  }

  if (!req.body.description) {
    return res.status(400).send({
      "status": "fail",
      "data": { "description" : "description is required" }
    });
  }

  if (!req.body.image_url) {
    return res.status(400).send({
      "status": "fail",
      "data": { "image_url" : "image_url is required" }
    });
  }

  if (!req.body.coordinates) {
    return res.status(400).send({
      "status": "fail",
      "data": { "coordinates" : "coordinates are required" }
    });
  }

  if (!req.body.coordinates["lat"] || !req.body.coordinates["lon"]) {
    return res.status(400).send({
      "status": "fail",
      "data": { "coordinates" : "coordinates must have both lat and lon fields" }
    });
  }

  if (req.body.coordinates["lon"] < -180 || req.body.coordinates["lon"] > 180) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lon" : "lon must have a valid value (between -180 and 180)" }
    });
  } 

  if (isNaN(req.body.coordinates["lon"])) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lon" : "lon must be a number" }
    });
  } 

  if (req.body.coordinates["lat"] < -90 || req.body.coordinates["lat"] > 90) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lat" : "lat must have a valid value (between -90 and 90)" }
    });
  } 

  if (isNaN(req.body.coordinates["lat"])) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lat" : "lat must be a number" }
    });
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
      res.status(201).send({
        "status": "success",
        "message": "Destination added successfully",
        "data" : { "destination" : data }
      });
    })
    .catch(err => {
      res.status(500).send({
        "status" : "error",
        "code": 500,
        "message" : err.message || "Some error occurred while creating the Destination."
      });
    });
};

// Retrieve all Destinations from the database.
exports.findAll = (req, res) => {

  const paginationOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 0
  }

  Destination.find({})
    .skip(paginationOptions.page * paginationOptions.limit)
    .limit(paginationOptions.limit)
    .then(data => {
      res.status(200).send({
        "status" : "success",
        "message": "Destinations retrieved successfully",
        "data" : {"destinations":data}
      });
     })
    .catch(err => {
      res.status(500).send({
        "status" : "error",
        "code": 500,
        "message" : err.message || "Some error occurred while retrieving the Destinations"
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Destination.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({
          "status" : "error",
          "code": 404,
          "message" : "Not found Destination with id="+id
        });
      else res.status(200).send({
          "status" : "success",
          "message": "Destination retrieved successfully",
          "data" : {"destination":data}
        });
    })
    .catch(err => {
      res.status(500).send({
        "status" : "error",
        "code": 500,
        "message" : "Error retrieving Destination with id=" + id
      });
    });
};

// Update a Destination by the id in the request
exports.update = (req, res) => {
  
  // Validate request
  // check id
  if (!req.params.id) {
    return res.status(400).send({
      "status": "fail",
      "data": { "id" : "id is required" }
    });
  }

  //console.log("req.params: ", req.params);
  //console.log("req.body: ", req.body);

  // check each field
  if (!req.body.name) {
    return res.status(400).send({
      "status": "fail",
      "data": { "name" : "name is required" }
    });
  }

  if (!req.body.description) {
    return res.status(400).send({
      "status": "fail",
      "data": { "description" : "description is required" }
    });
  }

  if (!req.body.image_url) {
    return res.status(400).send({
      "status": "fail",
      "data": { "image_url" : "image_url is required" }
    });
  }

  if (!req.body.coordinates) {
    return res.status(400).send({
      "status": "fail",
      "data": { "coordinates" : "coordinates is required" }
    });
  }

  if (!req.body.coordinates["lat"] || !req.body.coordinates["lon"]) {
    return res.status(400).send({
      "status": "fail",
      "data": { "coordinates" : "coordinates must have both lat and lon fields" }
    });
  }

  if (req.body.coordinates["lon"] < -180 || req.body.coordinates["lon"] > 180) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lon" : "lon must have a valid value (between -180 and 180)" }
    });
  } 

  if (isNaN(req.body.coordinates["lon"])) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lon" : "lon must be a number" }
    });
  } 

  if (req.body.coordinates["lat"] < -90 || req.body.coordinates["lat"] > 90) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lat" : "lat must have a valid value (between -90 and 90)" }
    });
  } 

  if (isNaN(req.body.coordinates["lat"])) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lat" : "lat must be a number" }
    });
  } 

  const id = req.params.id;

  Destination.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          "status" : "error",
          "code": 404,
          "message" : "Cannot update Destination with id="+id+". Maybe Destination was not found"
        });
      } else 
        res.status(200).send({
          status : "success",
          message : "Destination updated successfully",
          data : null
        });
    })
    .catch(err => {
      res.status(500).send({
        "status" : "error",
        "code": 500,
        "message" : "Error updating the Destination with id="+id
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
          "status" : "error",
          "code": 404,
          "message" : "Cannot delete Destination with id="+id+". Maybe Destination was not found"
        });
      } else {
        res.status(200).send({
          status : "success",
          message : "Destination deleted successfully",
          data : null
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        "status" : "error",
        "code": 500,
        "message" : "Could not delete the Destination with id="+id
      });
    });
};

// Delete all Destinations from the database.
exports.deleteAll = (req, res) => {

  Destination.deleteMany()
    .then(data => {
      res.status(200).send({
        status : "success",
        message : "Destinations deleted successfully",
        data : null
      });
    })
    .catch(err => {
      res.status(500).send({
        "status" : "error",
        "code": 500,
        "message" : "Some error occurred while removing all the destinations"
      });
    });
};

//import from a json file
exports.import = (req, res) => {
  const destinations = require("../../preset_destinations/preset_desinations.json");
  console.log("destinations: ", destinations);

  Destination.insertMany(destinations)
    .then(data => {
      res.status(200).send({
          "status" : "success",
          "message" : "Preset Destinations added successfully",
          "data" : {"destinations":data}
        });
    })
    .catch(err => {
      res.status(500).send({
          "status" : "error",
          "code": 500,
          "message" : "Some error occurred while importing destinations"
        });
    });
}
