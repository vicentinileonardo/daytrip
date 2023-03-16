module.exports = app => {
  const sessions = require("../controllers/session.controller.js");

  var router = require("express").Router();

  // Retrieve a single User with email and generate token
  router.post("/", sessions.findByEmail);

  // check and update token exp
  router.put("/", verifyToken, sessions.updateToken);


  // handle error 405 - method not allowed
  router.all("/", function(req, res, next) {
    let response = {
      "status": "error",
      "code": 405,
      "message": "The requested method is not allowed for the URL."
    }
    res.status(405).send(response);
  });

  app.use("/api/sessions", router);
  
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


function verifyToken(req, res, next) {
  const jwt = require('jsonwebtoken');

  // Get auth header value
  let token = req.headers['authorization'];
  console.log("token", token)  

  const SECRET_KEY = "MYKEY"

  if (!token) return res.status(401).send({
    "status": "fail",
    "code": 401,
    "data": {"authorization": "You need to be authenticated in order to access this method"}
  });
  try {    
    token = token.split(' ')[1];
    const verified = jwt.verify(token, SECRET_KEY);
    next();

  } catch (err) {
    res.status(400).send({
      "status": "error",
      "code": 400,
      "message": "JWT error, "+err["message"]
    });
  }
}