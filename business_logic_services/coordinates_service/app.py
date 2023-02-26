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
def geocode():

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
    
    external_response = requests.get(base_url + port + endpoint + query_string)

    status_code = external_response.status_code

    if status_code == 200:
        
        data = external_response.json().get("data")

        #bounding_box = data.get("geocode").get("boundingbox")
        # calculating mean_lat and mean_lon, keeping only 7 decimal places, like openstreetmap does
        #lat = round((float(bounding_box[0]) + float(bounding_box[1])) / 2, 7)
        #lon = round((float(bounding_box[2]) + float(bounding_box[3])) / 2, 7)

        lat = data.get("geocode").get("lat")
        lon = data.get("geocode").get("lon")

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
        return response, status_code
    else:
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error retrieving coordinates"    
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
