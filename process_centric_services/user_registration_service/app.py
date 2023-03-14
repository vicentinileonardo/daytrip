import datetime
from flask import Flask
from flask import request
import requests
import os
import re

app = Flask(__name__)

@app.route("/", methods=["GET"])
def check():
    
    response = {
        "status": "success",
        "message": "User Registration Process Centric Service is up and running!",
        "data": None
    }
    return response, 200

@app.route("/api/users/signup", methods=["POST"])
def user_registration():

    # get request body 
    request_body = request.get_json()
    
    # get request parameters
    name = request_body.get("name")
    surname = request_body.get("surname")
    email = request_body.get("email")
    password = request_body.get("password")
    address = request_body.get("address")
    city = request_body.get("city")
    country = request_body.get("country")

    print("name: ", name)
    print("surname: ", surname)
    print("email: ", email)
    print("password: ", password)
    print("address: ", address)
    print("city: ", city)
    print("country: ", country)


    # call the coordinates service



    # call the user_db_adapter service
    # get environment variable
    SERVICE_PORT = os.environ.get("USER_DB_ADAPTER_DOCKER_PORT")

    base_url = "http://user_db_adapter:"
    port = f"{SERVICE_PORT}"
    endpoint = "/api/users"
    
    try:
        # create the request body
        request_body = {
            "name": name,
            "surname": surname,
            "email": email,
            "password": password,
            "address": address,
            "city": city,
            "country": country
        }

        # post request
        external_response = requests.post(base_url + port + endpoint, json=request_body)
        status_code = external_response.status_code
        external_response = external_response.json()

    except requests.exceptions.ConnectionError:
        response = {
            "status": "error",
            "code": 500,
            "message": "Error connecting to User DB Adapter Service"
        }
        return response, 500

    if external_response.get("status") == "error":
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error retrieving destinations from User DB Adapter Service: " + external_response.get("message")
        }
        return response, status_code

    if external_response.get("status") == "fail":
        response = {
            "status": "fail",
            "data": external_response.get("data")
        }
        return response, status_code
    
    print("external_response: ", external_response)
    

    return response, 200
    


# error 404
@app.errorhandler(404)
def not_found(error):
    
    response = {
        "status": "error",
        "code": 404,
        "message": "The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again."
    }
    return response, 404

# handle all the other endpoints, POST, PUT, DELETE
@app.errorhandler(405)
def method_not_allowed(error):
        
    response = {
        "status": "error",
        "code": 405,
        "message": "The method is not allowed for the requested URL."
    }
    return response, 405
    