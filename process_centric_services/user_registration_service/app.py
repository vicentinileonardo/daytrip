from flask import Flask
from flask import request
import requests
import os

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

    try:
        request_body = request.get_json()
    except:
        response = {
            "status": "error",
            "code": 400,
            "message": "The request body is not valid JSON"
        }
        return response, 400
    
    # get and check all request parameters
    name = request_body.get("name")
    surname = request_body.get("surname")
    email = request_body.get("email")
    password = request_body.get("password")
    address = request_body.get("address")
    city = request_body.get("city")
    country = request_body.get("country")

    # call the valid_email service
    SERVICE_PORT = os.environ.get("VALID_EMAIL_SERVICE_DOCKER_PORT")

    base_url = "http://valid_email_service:"
    port = f"{SERVICE_PORT}"
    endpoint = "/api/email_checks/valid?"
    query_params = f"email={email}"
    
    try:
        external_response = requests.get(base_url + port + endpoint + query_params)
        status_code = external_response.status_code
        external_response = external_response.json()
    except requests.exceptions.ConnectionError:
        response = {
            "status": "error",
            "code": 500,
            "message": "Error connecting to Valid Email Service"
        }
        return response, 500
    
    if external_response.get("status") == "error":
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error retrieving destinations from Valid Email Service: " + external_response.get("message")
        }
        return response, status_code

    if external_response.get("status") == "fail":
        response = {
            "status": "fail",
            "data": external_response.get("data")
        }
        return response, status_code

    valid_email = external_response.get("data").get("email_check").get("valid")
    if not valid_email:
        response = {
            "status": "fail",
            "data": {
                "email": "The email is not valid, please use a real email"
            }
        }
        return response, 400
    

    

    # call the coordinates service

    

    '''

    # call the user_db_adapter service
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
    '''
    response = {
        "status": "test, dev",
    }
    

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
    