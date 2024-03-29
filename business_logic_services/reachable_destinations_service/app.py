from flask import Flask
from flask import request
import requests
import os
import json

app = Flask(__name__)

@app.route("/", methods=["GET"])
def check():
    
    response = {
        "status": "success",
        "message": "Reachable Destinations Business Logic Service is up and running!",
        "data": None
    }
    return response, 200

# Retrieves the reachable destinations available given an origin and a time budget
@app.route("/api/v1/destinations/reachable", methods=["GET"])
def reachable_destinations():

    lat_origin = request.args.get("lat_origin")
    lon_origin = request.args.get("lon_origin")
    timeBudgetInSec = request.args.get("timeBudgetInSec")

    if lat_origin is None:
        response = {
            "status": "fail",
            "data": {"lat_origin": "lat_origin is required"}
        }
        return response, 400

    # lat_origin must be a integer or float number between -90 and 90
    try:
        lat_origin = float(lat_origin)
        if lat_origin < -90 or lat_origin > 90:
            response = {
                "status": "fail",
                "data": {"lat_origin": "lat_origin must be a number between -90 and 90"}
            }
            return response, 400
    except ValueError:
        response = {
            "status": "fail",
            "data": {"lat_origin": "lat_origin must be a number"}
        }
        return response, 400

    if lon_origin is None:
        response = {
            "status": "fail",
            "data": {"lon_origin": "lon_origin is required"}
        }
        return response, 400

    # lon_origin must be a integer or float number between -180 and 180
    try:
        lon_origin = float(lon_origin)
        if lon_origin < -180 or lon_origin > 180:
            response = {
                "status": "fail",
                "data": {"lon_origin": "lon_origin must be a number between -180 and 180"}
            }
            return response, 400
    except ValueError:
        response = {
            "status": "fail",
            "data": {"lon_origin": "lon_origin must be a number"}
        }
        return response, 400

    if timeBudgetInSec is None:
        response = {
            "status": "fail",
            "data": {"timeBudgetInSec": "timeBudgetInSec is required"}
        }
        return response, 400
    
    # timeBudgetInSec must be a integer number greater than 0
    try:
        timeBudgetInSec = int(timeBudgetInSec)
        if timeBudgetInSec < 0:
            response = {
                "status": "fail",
                "data": {"timeBudgetInSec": "timeBudgetInSec must be a number greater than 0"}
            }
            return response, 400
    except ValueError:
        response = {
            "status": "fail",
            "data": {"timeBudgetInSec": "timeBudgetInSec must be a number"}
        }
        return response, 400
    
    # get environment variable
    DESTINATION_DB_ADAPTER_PORT = os.environ.get("DESTINATION_DB_ADAPTER_DOCKER_PORT")

    base_url = "http://destination_db_adapter:"
    port = f"{DESTINATION_DB_ADAPTER_PORT}"
    endpoint = "/api/v1/destinations"
    
    try:
        external_response = requests.get(base_url + port + endpoint)
        status_code = external_response.status_code
        external_response = external_response.json()
    except requests.exceptions.ConnectionError:
        response = {
            "status": "error",
            "code": 500,
            "message": "Error connecting to Destination DB Adapter Service"
        }
        return response, 500

    if external_response.get("status") == "error":
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error retrieving destinations from Destination DB Adapter Service: " + external_response.get("message")
        }
        return response, status_code

    if external_response.get("status") == "fail":
        response = {
            "status": "fail",
            "data": external_response.get("data")
        }
        return response, status_code

    destinations = external_response.get("data").get("destinations")

    # if there are no destinations in the database
    if destinations == [] or destinations == None:
        response = {
            "status": "fail",
            "data": {"reachable_destinations": "There are no destinations in the database"}
        }
        return response, 500
    
    # get environment variable
    RANGE_API_ADAPTER_PORT = os.environ.get("RANGE_API_ADAPTER_DOCKER_PORT")

    base_url = "http://range_api_adapter:"
    port = f"{RANGE_API_ADAPTER_PORT}"
    endpoint = "/api/v1/ranges"
    query_string = f"?lat={lat_origin}&lon={lon_origin}&timeBudgetInSec={timeBudgetInSec}"
    
    try:
        external_response = requests.get(base_url + port + endpoint + query_string)
        status_code = external_response.status_code
        external_response = external_response.json()
    except requests.exceptions.ConnectionError:
        response = {
            "status": "error",
            "code": 500,
            "message": "Error connecting to Range API Adapter Service"
        }
        return response, 500

    if external_response.get("status") == "error":
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error retrieving data from Range API Adapter Service: " + external_response.get("message")
        }
        return response, status_code

    if external_response.get("status") == "fail":
        response = {
            "status": "fail",
            "data": external_response.get("data")
        }
        return response, status_code

    boundary = external_response.get("data").get("range").get("boundary")
    
    # if there is no boundary
    if boundary == [] or boundary == None:
        response = {
            "status": "fail",
            "data": {"destinations": "There is no boundary"}
        }
        return response, 500

    boundary_points = []
    for boundary_point in boundary:
        boundary_points.append((boundary_point.get("latitude"), boundary_point.get("longitude")))
    
    origin_point = (lat_origin, lon_origin)

    #call to lambda function    
    
    request_body = {
        "boundary_points": boundary_points,
        "origin_point": origin_point,
        "destinations": destinations
    }
    
    #encode request body into json
    request_body = json.dumps(request_body)

    # get environment variable
    AWS_API_GATEWAY_URL = os.environ.get("AWS_API_GATEWAY_URL")

    base_url = f"{AWS_API_GATEWAY_URL}"
    endpoint = "/prod/boundary_info"

    try:
        external_response = requests.post(base_url + endpoint, data=request_body, headers={'Content-Type': 'application/json'})
        status_code = external_response.status_code
        external_response = external_response.json()
    except requests.exceptions.ConnectionError:
        response = {
            "status": "error",
            "code": 500,
            "message": "Error connecting to API Gateway or Lambda function"
        }
        return response, 500

    if external_response.get("status") == "error":
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error retrieving data from Boundary Service (Lambda): " + external_response.get("message")
        }
        return response, status_code

    if external_response.get("status") == "fail":
        response = {
            "status": "fail",
            "data": external_response.get("data")
        }
        return response, status_code
    
    reachable_destinations = external_response.get("data").get("destinations")
    
    if reachable_destinations == [] or reachable_destinations == None:
        response = {
            "status": "fail",
            "data": {"destinations": "There are no destinations reachable from the origin"}
        }
        return response, 400

    response = {
        "status": "success",
        "message": "Destinations reachable from the origin retrieved successfully",
        "data": {"destinations": reachable_destinations}
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
