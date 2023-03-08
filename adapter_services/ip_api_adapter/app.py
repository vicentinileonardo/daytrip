from flask import Flask
from flask import request
import requests
import re

app = Flask(__name__)

@app.route("/", methods=["GET"])
def check():
    
    response = {
        "status": "success",
        "message": "IP API Adapter is up and running!",
        "data": None
    }
    return response, 200

@app.route("/api/ip_info", methods=["GET"])
def ip_info():

    # extract the address from the query string
    ip_address = request.args.get("ip_address")

    if ip_address is None:
        response = {
            "status": "fail",
            "data": {"ip_address": "ip_address is required"}
        }
        return response, 400

    # validate the ip address both ipv4 and ipv6 with regex
    if not re.match(r"^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$", ip_address) and not re.match(r"^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$", ip_address):
        response = {
            "status": "fail",
            "data": {"ip_address": "ip_address is invalid"}
        }
        return response, 400

    # call the ip_api service
    ip_api_url = "http://ip-api.com/json/" + ip_address + "?fields=status,message,country,regionName,city,lat,lon,timezone,query";

    try:
        external_response = requests.get(ip_api_url)
        status_code = external_response.status_code
        external_response = external_response.json()
    except requests.exceptions.RequestException:
        response = {
            "status": "error",
            "code": 500,
            "message": "Error calling IP API"
        }
        return response, 500

    # check if the response is empty
    if external_response == [] or external_response == {} or external_response == None: 
        response = {
            "status": "fail",
            "data": {"ip_info": "ip_info not found"}  
        }
        return response, 400
    
    if status_code == 200:
        response = {
            "status": "success",
            "message" : "Ip info retrieved successfully",
            "data": {
                "ip_info": external_response
                }
        }
        return response, status_code
    else:
        response = {
            "status": "error",
            "code": status_code,
            "message": "Error calling IP API"
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

