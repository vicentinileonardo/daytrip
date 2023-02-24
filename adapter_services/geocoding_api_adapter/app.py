from flask import Flask
from flask import request
import requests

app = Flask(__name__)

nominatim_base_url = "https://nominatim.openstreetmap.org/search?";

@app.route("/", methods=["GET"])
def check():
    
    response = {
        "status": "success",
        "message": "Geocoding API Adapter is running",
        "data": None
    }
    return response, 200

@app.route("/api/geocodes", methods=["GET"])
def geocode():

    # extract the address from the query string
    address = request.args.get("address")

    if address is None:
        response = {
            "status": "fail",
            "data": {"address": "address is required"}
        }
        return response, 400

    # build the query string for the Nominatim API
    query_string = f"q={address}&format=json&limit=1"

    # call the Nominatim API
    external_response = requests.get(nominatim_base_url + query_string)

    # check if the response is empty
    data = external_response.json()
    if data == []:
        response = {
            "status": "fail",
            "data": {"address": "address not found"}  
        }
        return response, 400

    status_code = external_response.status_code
    data = data[0] # get the first element of the list, the first address found
    
    if status_code == 200:
        response = {
            "status": "success",
            "message" : "Geocodes retrieved successfully",
            "data": {
                "geocode": data
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

