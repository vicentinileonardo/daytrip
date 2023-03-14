from flask import Flask
from flask import request
import requests
import os

app = Flask(__name__)

@app.route("/", methods=["GET"])
def check():
    
    response = {
        "status": "success",
        "message": "Valid Email Business Logic Service is up and running!",
        "data": None
    }
    return response, 200

@app.route("/api/email_checks/valid", methods=["GET"])
def coordinates():

    email = request.args.get("email")

    if email is None:
        response = {
            "status": "fail",
            "data": {"email": "email is required"}
        }
        return response, 400
    
    # get environment variable
    SERVICE_PORT = os.environ.get("VALID_EMAIL_SERVICE_DOCKER_PORT")

    base_url = "http://emailcheck_api_adapter:"
    port = f"{SERVICE_PORT}"
    endpoint = "/api/email_checks?"
    query_string = f"email={email}"
    
    try:
        external_response = requests.get(base_url + port + endpoint + query_string)
        status_code = external_response.status_code
        external_response = external_response.json()
    except requests.exceptions.ConnectionError:
        response = {
            "status": "error",
            "code": 500,
            "message": "Error connecting to Email Check API Adapter Service"
        }
        return response, 500

    if external_response.get("status") == "error":
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error retrieving destinations from Email Check API Adapter Service: " + external_response.get("message")
        }
        return response, status_code

    if external_response.get("status") == "fail":
        response = {
            "status": "fail",
            "data": external_response.get("data")
        }
        return response, status_code
    
    email_check = external_response.get("data").get("email_check")

    deliverable = email_check.get("data").get("deliverable")
    spam = email_check.get("data").get("spam")
    
    email_check = {}
    email_check["email"] = email

    if deliverable == False or spam == True:
        email_check["valid"] = False
    else:
        email_check["valid"] = True

    response = {
        "status": "success",
        "message": "Email check retrieved successfully",
        "data": {
            "email_check": email_check
            }
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
