const fetch = require("node-fetch");

exports.findByEmail = async (req, res) => {
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
  endpoint = "/api/users?email="
  email_argument = req.body.email

  url= base_url + port + endpoint + email_argument

  external_response = await fetch(url);
  data = await external_response.json()

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

        const SECRET_KEY = "MYKEY"
        
        const user = {
          time: Date(),
          status: data["data"]["users"][0]["status"],
          userId: data["data"]["users"][0]["id"]
        };
      
        const token = "Bearer " + jwt.sign({ user }, SECRET_KEY, { expiresIn: '600s' });
      
        return res.status(200).send({
          "status": "success",
          "data": { "user" : data["data"]["users"][0],
                    "token" : token}
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
