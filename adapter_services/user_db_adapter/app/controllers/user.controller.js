const db = require("../models");
const User = db.users;
const bcrypt = require('bcrypt');

// Create and Save a new User
exports.create = (req, res) => {
  
  // Validate request
  if (!req.body.name) {
    return res.status(400).send({
      "status": "fail",
      "data": { "name" : "name is required" }
    });
  }

  if (!req.body.surname) {
    return res.status(400).send({
      "status": "fail",
      "data": { "surname" : "surname is required" }
    });
  }

  if (!req.body.email) {
    return res.status(400).send({
      "status": "fail",
      "data": { "email" : "email is required" }
    });
  }

  if (!req.body.password) {
    return res.status(400).send({
      "status": "fail",
      "data": { "password" : "password is required" }
    });
  }

  if (!req.body.status) {
    return res.status(400).send({
      "status": "fail",
      "data": { "status" : "status is required" }
    });
  }

  if (!req.body.origin_name) {
    return res.status(400).send({
      "status": "fail",
      "data": { "origin_name" : "origin_name is required" }
    });
  }

  if (!req.body.origin_coordinates) {
    return res.status(400).send({
      "status": "fail",
      "data": { "origin_coordinates" : "origin_coordinates is required" }
    });
  }

  if (!req.body.origin_coordinates["lat"] || !req.body.origin_coordinates["lon"]) {
    return res.status(400).send({
      "status": "fail",
      "data": { "origin_coordinates" : "origin_coordinates must have both lat and lon fields" }
    });
  }

  // Validate email format
  let email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  if (!email_regex.test(req.body.email)) {
    return res.status(400).send({
      "status": "fail",
      "data": { "email" : "email must have a valid format (string@string.string)" }
    });
  }

  if (req.body.origin_coordinates["lon"] < -180 || req.body.origin_coordinates["lon"] > 180) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lon" : "lon must have a valid value (between -180 and 180)" }
    });
  } 


  if (isNaN(req.body.origin_coordinates["lon"])) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lon" : "lon must be a number" }
    });
  } 

  if (req.body.origin_coordinates["lat"] < -90 || req.body.origin_coordinates["lat"] > 90) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lat" : "lat must have a valid value (between -90 and 90)" }
    });
  } 
 
  if (isNaN(req.body.origin_coordinates["lat"])) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lat" : "lat must be a number" }
    });
  } 

  //hash password
  const saltRounds = 10;
  let password = String(req.body.password);

  bcrypt.hash(password, saltRounds, function(err, hash) {
    
    // Create a User
    const user = new User({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: hash,
      status: req.body.status,
      origin_name: req.body.origin_name,
      origin_coordinates: {
        lat:req.body.origin_coordinates["lat"],
        lon:req.body.origin_coordinates["lon"]
      }
    });
  
    // Save User in the database
    user
      .save(user)
      .then(data => {
        res.status(201).send({
            "status": "success",
            "message": "User added successfully",
            "data" : { "user" : data }
          });
      })
      .catch(err => {
        res.status(500).send({
            "status" : "error",
            "code": 500,
            "message" : err.message || "Some error occurred while creating the User."
          });
      });

  });

};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  
  //Add pagination
  const paginationOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 0
  }

  //condition
  const email = req.query.email;
  var condition = email ? { email: { $regex: new RegExp(email), $options: "i" } } : {};

  User.find(condition)
    .skip(paginationOptions.page * paginationOptions.limit)
    .limit(paginationOptions.limit)
    .then(data => {
      res.status(200).send({
          "status" : "success",
          "message": "Users retrieved successfully",
          "data" : {"users":data}
        });
    })
    .catch(err => {
      res.status(500).send({
          "status" : "error",
          "code": 500,
          "message" : err.message || "Some error occurred while retrieving the Users"
        });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then(data => {
      if (!data) res.status(404).send({
          "status" : "error",
          "code": 404,
          "message" : "Not found User with id="+id
        });
      else res.status(200).send({
          "status" : "success",
          "message": "User retrieved successfully",
          "data" : {"user":data}
        });
    })
    .catch(err => {
      res.status(500).send({
        "status" : "error",
        "code": 500,
        "message" : "Error retrieving User with id=" + id
      });
    });
};

// Retrieve all Users from the database.
exports.findByEmail = (req, res) => {
  const email = req.params.email;

  //condition
  var condition = { "email": email };

  User.find(condition)
    .then(data => {
        res.status(200).send({
          "status" : "success",
          "message": "User retrieved successfully",
          "data" : {"user":data[0]}
        });
    })
    .catch(err => {
      res.status(500).send({
          "status" : "error",
          "code": 500,
          "message" : err.message || "Some error occurred while retrieving the User"
        });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  
  // Validate request
  // check id
  if (!req.params.id) {
    return res.status(400).send({
      "status": "fail",
      "data": { "id" : "id is required" }
    });
  }

  // check each field
  if (!req.body.name) {
    return res.status(400).send({
      "status": "fail",
      "data": { "name" : "name is required" }
    });
  }

  if (!req.body.surname) {
    return res.status(400).send({
      "status": "fail",
      "data": { "surname" : "surname is required" }
    });
  }

  if (!req.body.email) {
    return res.status(400).send({
      "status": "fail",
      "data": { "email" : "email is required" }
    });
  }

  if (!req.body.password) {
    return res.status(400).send({
      "status": "fail",
      "data": { "password" : "password is required" }
    });
  }

  if (!req.body.status) {
    return res.status(400).send({
      "status": "fail",
      "data": { "status" : "status is required" }
    });
  }

  if (!req.body.origin_name) {
    return res.status(400).send({
      "status": "fail",
      "data": { "origin_name" : "origin_name is required" }
    });
  }

  if (!req.body.origin_coordinates) {
    return res.status(400).send({
      "status": "fail",
      "data": { "origin_coordinates" : "origin_coordinates is required" }
    });
  }

  if (!req.body.origin_coordinates["lat"] || !req.body.origin_coordinates["lon"]) {
    return res.status(400).send({
      "status": "fail",
      "data": { "origin_coordinates" : "origin_coordinates must have both lat and lon fields" }
    });
  }

  // Validate email format
  let email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  if (!email_regex.test(req.body.email)) {
    return res.status(400).send({
      "status": "fail",
      "data": { "email" : "email must have a valid format (string@string.string)" }
    });
  }

  if (req.body.origin_coordinates["lon"] < -180 || req.body.origin_coordinates["lon"] > 180) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lon" : "lon must have a valid value (between -180 and 180)" }
    });
  } 

  if (isNaN(req.body.origin_coordinates["lon"])) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lon" : "lon must be a number" }
    });
  } 

  if (req.body.origin_coordinates["lat"] < -90 || req.body.origin_coordinates["lat"] > 90) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lat" : "lat must have a valid value (between -90 and 90)" }
    });
  } 

  if (isNaN(req.body.origin_coordinates["lat"])) {
    return res.status(400).send({
      "status": "fail",
      "data": { "lat" : "lat must be a number" }
    });
  } 

  const id = req.params.id;
  let user_to_update = req.body;
  let password = String(req.body.password);

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function(err, hash) {

    user_to_update.password = hash;

    User.findByIdAndUpdate(id, user_to_update, { useFindAndModify: false })
      .then(data => {
      if (!data) {
        res.status(404).send({
            "status" : "error",
            "code": 404,
            "message" : "Cannot update User with id="+id+". Maybe User was not found"
          });
        } else 
          res.status(200).send({
            status : "success",
            message : "User updated successfully",
            data : null
          });
    })
    .catch(err => {
      res.status(500).send({
          "status" : "error",
          "code": 500,
          "message" : "Error updating the User with id="+id
        });
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
            "status" : "error",
            "code": 404,
            "message" : "Cannot delete User with id="+id+". Maybe User was not found"
          });
      } else {
        res.status(200).send({
          status : "success",
          message : "User deleted successfully",
          data : null
        });
      }
    })
    .catch(err => {
      res.status(500).send({
          "status" : "error",
          "code": 500,
          "message" : "Could not delete the User with id="+id
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
      res.status(200).send({
        status : "success",
        message : "Users deleted successfully",
        data : null
      });
    })
    .catch(err => {
      res.status(500).send({
          "status" : "error",
          "code": 500,
          "message" : "Some error occurred while removing all the users"
        });
    });
};

//import from a json file
exports.import = (req, res) => {
  const users = require("../../dummy_data/dummy_users.json");
  console.log("users: ", users);

  User.insertMany(users)
    .then(data => {
      res.status(200).send({
          "status" : "success",
          "message" : "Dummy Users added successfully",
          "data" : {"users":data}
        });
    })
    .catch(err => {
      res.status(500).send({
          "status" : "error",
          "code": 500,
          "message" : "Some error occurred while importing users"
        });
    });
}
