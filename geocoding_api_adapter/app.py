from flask import Flask
from flask import request
import requests

app = Flask(__name__)

nominatim_base_url = "https://nominatim.openstreetmap.org/search?";

@app.route("/", methods=["GET"])
def check():
    return "GeoCoding API Adapter is up and running!", 200

@app.route("/api/geocode", methods=["GET"])
def geocode():

    # extract the address from the query string
    address = request.args.get("address")

    # build the query string for the Nominatim API
    query_string = f"q={address}&format=json&limit=1"

    # call the Nominatim API
    response = requests.get(nominatim_base_url + query_string)

    status_code = response.status_code

    response = response.json()[0]

    # return the response from the Nominatim API, with error handling
    if status_code == 200:
        return response, 200
    else:
        return "Error calling Nominatim API", 500

# error 404
@app.errorhandler(404)
def not_found(error):
    return "Not found", 404
