const fetch = require("node-fetch");

exports.findByEmail = async (req, res) => {
  const bcrypt = require('bcrypt');

  if (!req.query.email) {
    return res.status(400).send({
      "status": "fail",
      "data": { "email" : "email is required" }
    });
  }

  if (!req.query.password) {
    return res.status(400).send({
      "status": "fail",
      "data": { "password" : "password is required" }
    });
  }

  base_url="http://user_db_adapter:"
  port = process.env.USER_DB_ADAPTER_DOCKER_PORT || 8080;
  endpoint = "/api/users/email/"
  email_argument = req.query.email

  url= base_url + port + endpoint + email_argument

  external_response = await fetch(url);
  data = await external_response.json()

  bcrypt.compare(req.query.password,data["data"]["user"]["password"],(err,result)=>{
    if(err){
      return res.status(400).send({
        "status": "error",
        "data": { "password" : "passwords doesnt match and err" }
      });
    }
    if(result){
      return res.status(200).send({
        "status": "success",
        "data": { "password" : "passwords match" }
      });
    }else{
      return res.status(400).send({
        "status": "error",
        "data": { "password" : "passwords doesnt match" }
      });
    }
  })

};
