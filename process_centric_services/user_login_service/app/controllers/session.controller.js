const fetch = require("node-fetch");

exports.login = async (req, res) => {
  const bcrypt = require('bcrypt');

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

  base_url="http://user_db_adapter:"
  port = process.env.USER_DB_ADAPTER_DOCKER_PORT || 8080;
  endpoint = "/api/v1/users?email="
  email_argument = req.body.email

  url= base_url + port + endpoint + email_argument

  try {
    external_response = await fetch(url);
    data = await external_response.json();
  } catch (error) {
    response = {
      "status": "error",
      "code": 500,
      "message": "Error in fetching data from external API"
    }
    return res.status(500).send(response);
  }

  if(data["data"]["users"][0]){
    bcrypt.compare(req.body.password,data["data"]["users"][0]["password"],(err,result)=>{
      if(err){
        return res.status(500).send({
          "status": "error",
          "code": 500,
          "message" : err.message || "Some error occurred while retrieving the User."
      });
      }
      if(result){
        const jwt = require('jsonwebtoken');

        const SECRET_KEY = process.env.JWT_SECRET;
        
        const user = {
          time: Date(),
          status: data["data"]["users"][0]["status"],
          userId: data["data"]["users"][0]["id"],
          email: data["data"]["users"][0]["email"],
          origin_name: data["data"]["users"][0]["origin_name"]
        };
      
        const token = "Bearer " + jwt.sign({ user }, SECRET_KEY, { expiresIn: '1000s' });
      
        return res.status(201).send({
          "status": "success",
          "message": "User logged in successfully.",
          "data": { "token" : token}
        });

      }else{
        return res.status(400).send({
          "status": "fail",
          "data": { "password" : "Wrong Password."}
        });
      }
    })

  }else{
    
    return res.status(404).send({
      "status": "error",
      "code": 404,
      "message" : "No user with email = "+email_argument+" was found"
    });
  }

};

exports.updateToken = async (req, res) => {
  const jwt = require('jsonwebtoken');

  // Get auth header value
  let token = req.headers['authorization'];

  const SECRET_KEY = process.env.JWT_SECRET;

  if (!token) return res.status(401).send({
    "status": "fail",
    "data": {"authorization": "You need to be authenticated in order to access this method"}
  });

  decoded_token=JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())["user"];

  const user = {
    time: Date(),
    status: decoded_token["status"],
    userId: decoded_token["userId"],
    email: decoded_token["email"],
    origin_name: decoded_token["origin_name"]
  };

  const new_token = "Bearer " + jwt.sign({ user }, SECRET_KEY, { expiresIn: '1000s' });

  return res.status(200).send({
    "status": "success",
    "message": "Token updated successfully.",
    "data": { "token" : new_token}
  });

};
