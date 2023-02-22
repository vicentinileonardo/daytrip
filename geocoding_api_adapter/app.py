from flask import Flask
from flask import request
import requests

app = Flask(__name__)

@app.route("/", methods=["GET"])
def check():
    return "GeoCoding API Adapter is up and running!", 200

@app.route("/geocode", methods=["GET"])
def geocode():

    # extract the address from the query string
    address = request.args.get("address")

    return f"Address provided: {address}", 200