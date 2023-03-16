from flask import Flask
from flask import request
import requests
import os

app = Flask(__name__)

@app.route("/", methods=["GET"])
def check():
    
    response = {
        "status": "success",
        "message": "Air pollution API Adapter is up and running!",
        "data": None
    }
    return response, 200

@app.route("/api/air_pollution_info", methods=["GET"])
def air_pollution_info():

    # extract the address from the query string
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if lat is None:
        response = {
            "status": "fail",
            "data": {"lat": "lat is required"}
        }
        return response, 400

    # lat must be a integer or float number between -90 and 90
    try:
        lat = float(lat)
        if lat < -90 or lat > 90:
            response = {
                "status": "fail",
                "data": {"lat": "lat must be a number between -90 and 90"}
            }
            return response, 400
    except ValueError:
        response = {
            "status": "fail",
            "data": {"lat": "lat must be a number"}
        }
        return response, 400
    
    if lon is None:
        response = {
            "status": "fail",
            "data": {"lon": "lon is required"}
        }
        return response, 400

    # lon must be a integer or float number between -180 and 180
    try:
        lon = float(lon)
        if lon < -180 or lon > 180:
            response = {
                "status": "fail",
                "data": {"lon": "lon must be a number between -180 and 180"}
            }
            return response, 400
    except ValueError:
        response = {
            "status": "fail",
            "data": {"lon": "lon must be a number"}
        }
        return response, 400

    # call the OpenWeatherMap API
    open_weather_base_url = "http://api.openweathermap.org/data/2.5/air_pollution/forecast?"
    full_url = open_weather_base_url + "lat=" + str(lat) + "&lon=" + str(lon) + "&appid=" + os.environ.get("OPENWEATHER_API_KEY")

    try:
        external_response = requests.get(full_url)
        status_code = external_response.status_code
        external_response = external_response.json()
    except requests.exceptions.RequestException:
        response = {
            "status": "error",
            "code": 500,
            "message": "Error calling OpenWeatherMap API"
        }
        return response, 500

    # check if the response is empty
    if external_response == [] or external_response == {} or external_response == None: 
        response = {
            "status": "fail",
            "data": {"air_pollution_info": "air_pollution_info not found"}  
        }
        return response, 400
    
    if status_code == 200:

        forecasts = external_response["list"]
        aqi_list = [item["main"]["aqi"] for item in forecasts]
       
        aqi = sum(aqi_list) / len(aqi_list)

        response = {
            "status": "success",
            "message" : "Air pollution info retrieved successfully",
            "data": {
                "air_pollution_info": {
                    "lat": lat,
                    "lon": lon,
                    "aqi": aqi
                }
            }
        }

        return response, status_code
    else:
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error calling OpenWeatherMap API"
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

