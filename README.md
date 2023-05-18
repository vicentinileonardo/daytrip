# Daytrip
## A service-oriented web application for inspiring daytrips in Italy


This project aims to create a web application that suggests daytrip destinations in Italy based on weather conditions, travel time, and other indicators. A service-oriented architecture was used to build decoupled services that can be expanded and modified independently.


## Features

+ Suggests ranked list of daytrip destinations based on weather, travel time, crowdedness, and other indicators
+ Uses both internal and external data sources to provide recommendations
+ Scalable service-oriented architecture that can easily incorporate new ranking indicators
+ Docker Compose used to deploy the multi-container application
+ REST APIs built to represent data resources


## Architecture

The architecture is divided into 4 layers:

1. **Data layer** - Contains databases and services for external data
2. **Adapter layer** - Standardizes data from external APIs
3. **Business logic layer** - Calculates ratings and performs business logic
4. **Process centric layer** - Provides high level functionality to end users

In total, 25 services were built across the 4 layers. Docker Compose is used to define and deploy the multi-container application.

## Technologies

+ Python (Flask)
+ JavaScript (Node.js)
+ MongoDB
+ Docker
+ Docker Compose
+ AWS Lambda

## External sources

The project leverages a number of external data sources to provide recommendations:

+ TomTom APIs - Used to calculate reachable ranges based on travel time and vehicle, and to determine crowdedness based on traffic flow data. 

+ Weather APIs - Weather API and OpenWeatherMap API are used to gather data on temperature, precipitation, wind, and air quality. This provides important indicators for recommending daytrip destinations.

+ Geocoding APIs - OpenStreetMap, and Google Maps APIs are used to convert between addresses and geographic coordinates, which is necessary to determine distances and travel times.

+ IP geocoding APIs - ip-api and ipify APIs are used to determine the user's origin location based on their IP address. This is used as the starting point for destination recommendations.

+ Email validation API - EVA API is used to validate user emails during registration to ensure they are real email addresses.

## Response structure

JSON specification used: JSend specification (https://github.com/omniti-labs/jsend)

```json
{
  "status": "success",
  "message": "User found",
  "data": 
  {
    "user": {
      "id": "60f9b9b0e3c6b8a2b4b1f1f1",
      "name": "John Doe",
      "email": "" 
    }
  }
}
```
  
```json
{
  "status": "success",
  "message": "Users found",
  "data": {
    "users": [
      {
        "id": "60f9b9b0b9b9b9b9b9b9b9b9",
        "name": "John Doe",
        "email": ""
      },
      {
        "id": "456w232323",
        "name": "Jane Smith",
        "email": ""
      }
    ]
  }
}

```
Fail
When an API call is rejected due to invalid data or call conditions, the JSend object's data key contains an object explaining what went wrong, typically a hash of validation errors. For example:

```json
{
  "status": "fail",
  "data": { "lon" : "lon is required" }
}
```

Error
When an API call fails due to an error on the server. For example:

```json
{
  "status": "error",
  "code": 500,
  "message": "Unable to communicate with database"
}
```

# Future improvements

+ API caching: https://www.npmjs.com/package/apicache middleware (da solo o con redis)

+ Service Registry and Discovery in a more structured way


## Acknowledgements

+ Node.js + Mongoose skeleton template: https://github.com/bezkoder

+ JSend specification: https://github.com/omniti-labs/jsend

+ GeoCoding (Nominatim): © OpenStreetMap

+ Nominatim self-hosted as a docker container (Discarded idea, oot used, too slow startup for the demo test of the project): https://github.com/mediagis/nominatim-docker

+ Layers for AWS Lambda function: https://github.com/keithrozario/Klayers
