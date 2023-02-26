from flask import Flask
from flask import request
import requests
import os
import matplotlib.path as mplPath

app = Flask(__name__)

@app.route("/", methods=["GET"])
def check():
    
    response = {
        "status": "success",
        "message": "Reachable Destinations Business Logic Service is up and running",
        "data": None
    }
    return response, 200

@app.route("/api/destinations/reachable", methods=["GET"])
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
    endpoint = "/api/destinations"
    
    external_response = requests.get(base_url + port + endpoint)
    status_code = external_response.status_code

    if status_code != 200:
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error retrieving destinations from Destination DB Adapter Service"    
        }
        return response, status_code

    
    data = external_response.json().get("data")
    destinations = data.get("destinations")

    if destinations == []:
        response = {
            "status": "fail",
            "data": {"reachable_destinations": "There are no destinations in the database"}
        }
        return response, 500
    
    # get environment variable
    RANGE_API_ADAPTER_PORT = os.environ.get("RANGE_API_ADAPTER_DOCKER_PORT")

    base_url = "http://range_api_adapter:"
    port = f"{RANGE_API_ADAPTER_PORT}"
    endpoint = "/api/ranges"
    query_string = f"?lat={lat_origin}&lon={lon_origin}&timeBudgetInSec={timeBudgetInSec}"
    
    external_response = requests.get(base_url + port + endpoint + query_string)
    status_code = external_response.status_code

    if status_code != 200:
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error retrieving ranges from Range API Adapter Service, coordinates could be in the middle of the ocean or in a place where there is no data"    
        }
        return response, status_code
    
    data = external_response.json().get("data")
    boundary = data.get("range").get("boundary")

    boundary_points = []
    for boundary_point in boundary:
        boundary_points.append((boundary_point.get("latitude"), boundary_point.get("longitude")))
    
    origin_point = (lat_origin, lon_origin)
    
    path = mplPath.Path(boundary_points)
    origin_in_polygon = path.contains_points([origin_point])

    # if origin is not inside polygon
    if not origin_in_polygon:
        response = {
            "status": "fail",
            "data": {"reachable_destinations": "The origin is not inside the range, weird because the range was calculated using the origin"}
        }
        return response, 500

    # check every destination if it is inside the range
    print("destinations", destinations)
    reachable_destinations = []
    for destination in destinations:
        print("destination", destination)
        destination_point = (destination.get("coordinates").get("lat"), destination.get("coordinates").get("lon"))
        print("destination_point", destination_point)

        destination_in_polygon = path.contains_points([destination_point])
        print("destination_in_polygon", destination_in_polygon)
        if destination_in_polygon:
            reachable_destinations.append(destination)
    
    if reachable_destinations == []:
        response = {
            "status": "fail",
            "data": {"reachable_destinations": "There are no destinations reachable from the origin"}
        }
        return response, 400

    response = {
        "status": "success",
        "message": "Destinations reachable from the origin",
        "data": {"reachable_destinations": reachable_destinations}
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
