from flask import Flask
from flask import request
import requests
import os

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
def coordinates():

    location_name = request.args.get("location_name")

    if location_name is None:
        response = {
            "status": "fail",
            "data": {"location_name": "location_name is required"}
        }
        return response, 400
    
    # get environment variable
    SERVICE_PORT = os.environ.get("GEOCODING_API_ADAPTER_DOCKER_PORT")

    base_url = "http://geocoding_api_adapter:"
    port = f"{SERVICE_PORT}"
    endpoint = "/api/geocodes?"
    query_string = f"address={location_name}"
    
    try:
        external_response = requests.get(base_url + port + endpoint + query_string)
        status_code = external_response.status_code
        external_response = external_response.json()
    except requests.exceptions.ConnectionError:
        response = {
            "status": "error",
            "code": 500,
            "message": "Error connecting to Geocoding API Adapter Service"
        }
        return response, 500

    if external_response.get("status") == "error":
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error retrieving destinations from Geocoding API Adapter Service: " + external_response.get("message")
        }
        return response, status_code

    if external_response.get("status") == "fail":
        response = {
            "status": "fail",
            "data": external_response.get("data")
        }
        return response, status_code
    
    lat = external_response.get("data").get("geocode").get("lat")
    lon = external_response.get("data").get("geocode").get("lon")

    # round to 7 decimal places, like openstreetmap does
    lat = round(float(lat), 7)
    lon = round(float(lon), 7)
    
    coordinates = {
        "lat": lat,
        "lon": lon
    }

    response = {
        "status": "success",
        "message": "Coordinates retrieved successfully",
        "data": {
            "coordinates": coordinates
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
