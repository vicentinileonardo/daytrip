from flask import Flask
from flask import request
import requests

app = Flask(__name__)

@app.route("/", methods=["GET"])
def check():
    
    response = {
        "status": "success",
        "message": "Coordinates Business Logic Service is up and running",
        "data": None
    }
    return response, 200

@app.route("/api/coordinates", methods=["GET"])
def geocode():

    location_name = request.args.get("location_name")

    if location_name is None:
        response = {
            "status": "fail",
            "data": {"location_name": "location_name is required"}
        }
        return response, 400
    
    base_url = "http://geocoding_api_adapter:8080/api/geocodes?";

    query_string = f"address={location_name}"
    
    external_response = requests.get(base_url + query_string)

    status_code = external_response.status_code

    if status_code == 200:
        print(external_response.json())
        #data = external_response.json()[0]
        response = {
            "status": "success",
            "data": {
                "geocode": external_response.json()
                }
        }
        return response, status_code
    else:
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error calling Nominatim API"    
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

