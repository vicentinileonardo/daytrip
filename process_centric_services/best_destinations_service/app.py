import datetime
from flask import Flask
from flask import request
import requests
import os
import re

app = Flask(__name__)

'''
# allow CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response
'''

@app.route("/", methods=["GET"])
def check():
    
    response = {
        "status": "success",
        "message": "Best Destinations Process Centric Service is up and running!",
        "data": None
    }
    return response, 200

@app.route("/api/v1/destinations/best", methods=["GET"])
def best_destinations():

    address = request.args.get("address")
    date = request.args.get("date")
    timeBudgetInHour = request.args.get("timeBudgetInHour")

    if address is None:
        response = {
            "status": "fail",
            "data": {"address": "address is required"}
        }
        return response, 400

    if date is None:
        response = {
            "status": "fail",
            "data": {"date": "date is required"}
        }
        return response, 400
    
    # date must be in the format YYYY-MM-DD, using regex, second filed must be between 01 and 12, third field must be between 01 and 31
    if not re.match(r"^\d{4}-\d{2}-\d{2}$", date) or int(date[5:7]) < 1 or int(date[5:7]) > 12 or int(date[8:10]) < 1 or int(date[8:10]) > 31:
        response = {
            "status": "fail",
            "data": {"date": "date must be in the format YYYY-MM-DD"}
        }
        return response, 400
    
    # date should be between today and next 14 days
    today = datetime.date.today()
    next_14_days = today + datetime.timedelta(days=14)
    date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
    if date < today or date > next_14_days:
        response = {
            "status": "fail",
            "data": {"date": "date must be between today and next 14 days"}
        }
        return response, 400

    if timeBudgetInHour is None:
        response = {
            "status": "fail",
            "data": {"timeBudgetInHour": "timeBudgetInHour is required"}
        }
        return response, 400
    
    # timeBudgetInHour must be a float number greater than 0 and of shape like 1.0 or 1.5
    try:
        timeBudgetInHour = float(timeBudgetInHour)
        if timeBudgetInHour <= 0:
            response = {
                "status": "fail",
                "data": {"timeBudgetInHour": "timeBudgetInHour must be a number greater than 0"}
            }
            return response, 400
        
        if timeBudgetInHour % 1 != 0 and timeBudgetInHour % 0.5 != 0:
            response = {
                "status": "fail",
                "data": {"timeBudgetInHour": "timeBudgetInHour must be a number of shape like 1.0 or 1.5"}
            }
            return response, 400
    except ValueError:
        response = {
            "status": "fail",
            "data": {"timeBudgetInHour": "timeBudgetInHour must be a number"}
        }
        return response, 400
    
    # convert timeBudgetInHour to seconds, can be also 4,5 hours
    timeBudgetInSec = int(timeBudgetInHour * 3600)

    COORDINATES_SERVICE_PORT = os.environ.get("COORDINATES_SERVICE_DOCKER_PORT")

    base_url = "http://coordinates_service:"
    port = f"{COORDINATES_SERVICE_PORT}"
    endpoint = "/api/v1/coordinates"
    query_string = f"?location_name={address}"

    try:
        external_response = requests.get(base_url + port + endpoint + query_string)
        status_code = external_response.status_code
        external_response = external_response.json()
    except requests.exceptions.ConnectionError:
        response = {
            "status": "error",
            "code": 500,
            "message": "Error connecting to Coordinates Service"
        }
        return response, 500
    
    if external_response.get("status") == "error":
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error retrieving coordinates from Coordinates Service: " + external_response.get("message")
        }
        return response, status_code
    
    if external_response.get("status") == "fail":
        response = {
            "status": "fail",
            "data": external_response.get("data")
        }
        
        return response, 400
    
    lat_origin = external_response.get("data").get("coordinates").get("lat")
    lon_origin = external_response.get("data").get("coordinates").get("lon")

    # get environment variable
    REACHABLE_DESTINATIONS_SERVICE_PORT = os.environ.get("REACHABLE_DESTINATIONS_SERVICE_DOCKER_PORT")

    base_url = "http://reachable_destinations_service:"
    port = f"{REACHABLE_DESTINATIONS_SERVICE_PORT}"
    endpoint = "/api/v1/destinations/reachable"
    query_string = f"?lat_origin={lat_origin}&lon_origin={lon_origin}&timeBudgetInSec={timeBudgetInSec}"
    
    try:
        external_response = requests.get(base_url + port + endpoint + query_string)
        status_code = external_response.status_code
        external_response = external_response.json()
    except requests.exceptions.ConnectionError:
        response = {
            "status": "error",
            "code": 500,
            "message": "Error connecting to Reachable Destinations Service"
        }
        return response, 500
    
    if external_response.get("status") == "error":
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error retrieving destinations from Reachable Destinations Service: " + external_response.get("message")
        }
        return response, status_code

    if external_response.get("status") == "fail":
        response = {
            "status": "fail",
            "data": external_response.get("data")
        }
        return response, status_code

    reachable_destinations = external_response.get("data").get("destinations")

    # if there are no destinations in the database
    if reachable_destinations == [] or reachable_destinations is None:
        response = {
            "status": "fail",
            "data": {"destinations": "There are no reachable destinations"}
        }
        return response, 500
    
    # get environment variable
    COORDINATES_RATING_SERVICE_PORT = os.environ.get("COORDINATES_RATING_SERVICE_DOCKER_PORT")

    base_url = "http://coordinates_rating_service:"
    port = f"{COORDINATES_RATING_SERVICE_PORT}"
    endpoint = "/api/v1/ratings"
    
    # loop trough reachable destinations and add rating to each one
    for destination in reachable_destinations:

        lat = destination.get("coordinates").get("lat")
        lon = destination.get("coordinates").get("lon")

        query_string = f"?lat={lat}&lon={lon}&date={date}"
        request_url = base_url + port + endpoint + query_string
        
        try:
            external_response = requests.get(request_url)
            status_code = external_response.status_code
            external_response = external_response.json()
        except requests.exceptions.ConnectionError:
            response = {
                "status": "error",
                "code": 500,
                "message": "Error connecting to Coordinates Rating Service"
            }
            return response, 500

        if external_response.get("status") == "error":
            response = {
                "status": "error",
                "code": status_code,
                "message": "Error retrieving data from Coordinates Rating Service: " + external_response.get("message")
            }
            return response, status_code

        if external_response.get("status") == "fail":
            response = {
                "status": "fail",
                "data": external_response.get("data")
            }
            return response, status_code
        
        rating = external_response.get("data").get("rating").get("final_rating")
        
        destination["rating"] = rating
       
    
    # sort destinations by rating
    sorted_destinations = sorted(reachable_destinations, key=lambda k: k['rating'], reverse=True)

    # add a rank to each destination
    for i, destination in enumerate(sorted_destinations):
        destination["rank"] = i + 1

    response = {
        "status": "success",
        "message": "Best destinations retrieved successfully",
        "data": {
            "destinations": sorted_destinations
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
    