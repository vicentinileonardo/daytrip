from flask import Flask
from flask import request
import requests

app = Flask(__name__)

@app.route("/", methods=["GET"])
def check():
    
    response = {
        "status": "success",
        "message": "Email check API Adapter is up and running!",
        "data": None
    }
    return response, 200

@app.route("/api/email_checks", methods=["GET"])
def email_check():

    # extract the email from the query string
    email = request.args.get("email")

    if email is None:
        response = {
            "status": "fail",
            "data": {"email": "email is required"}
        }
        return response, 400    

    # call the EVA api, not using https because of certificate issue (expired)
    eva_base_url = "http://api.eva.pingutil.com/email"

    # build the query string for the EVA API
    query_string = "?email=" + email

    full_url = eva_base_url + query_string
    
    try:
        # make the request
        external_response = requests.get(full_url)
        status_code = external_response.status_code
        external_response = external_response.json()
    except requests.exceptions.RequestException:
        response = {
            "status": "error",
            "code": 500,
            "message": "Error calling EVA API"    
        }
        return response, 500

    # check if the response is empty
    if external_response == [] or external_response == {} or external_response == None: 
        response = {
            "status": "fail",
            "data": {"email": "email not found"}  
        }
        return response, 400
    
    if status_code == 200:
        response = {
            "status": "success",
            "message" : "Email check retrieved successfully",
            "data": {
                "email_check": external_response
                }
        }
        return response, status_code
    else:
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error calling EmailRep API"    
        }
        return response, status_code

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
