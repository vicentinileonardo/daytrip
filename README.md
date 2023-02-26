# daytrip
Repository related to the project of the Service Design and Engineering graduate course of University of Trento, academic year 2022/2023.

The goal of the project is to ideate, design, develop a service-oriented application


## generic ideas

[Google Doc](https://docs.google.com/document/d/1lDv2JqqlVAuygN2xbacw2XYzxtcyGfdxOXr0agXboIM/edit)

combining weather and traffic data in order to propose daytrips to users.

use current location (either automatically retrieved if authorized, or just a parameter inserted)
other parameters:  drive distance, only public transportation 

database of points of interests to choose from


authentication: google

external apis: 
+ weather apis
  - tomorrow
+ tomtom apis for trafic
+ for the maps: OpenStreetMap, Leaflet, Nominatim (maybe), or just use the tomtom api should be fine


api paradigms: REST and GraphQL (probably we should try to use both for different tasks, due to our lab session)

databases: MongoDB (on-premise)

object storage (if needed): amazon S3 (cloud-based). For instance: Image service which use S3 as data layer. Images could be retrieved for the various point of interests (or only for the most important)


docker compose for the entire infrastructure


## Response structure
JSend specification: https://github.com/omniti-labs/jsend

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

## TODO

+ controllare versione mongoose
+ controllare versione node
+ integrazione con graphql nel destination_db_adapter
+ DOCUMENTAZIONE API
+ valutare se aggiungere versioning (v1) all'endpoint delle api
+ conrollare che le post diano 201 (created) e non 200 (ok) 
+ vari ERRORI 404
+ vari ERRORI 405 (method not allowed), valutare come gestire
+ controllo status code errori, per adesso sono tutti 400 (bad request)
+ pagination and limit in all GET requests (find all)
+ registrazione utente, login, logout
+ Some API endpoints should require a basic form of authentication: creazione, modifica, eliminazione destinations
  - accesso non consentito se non autenticato, errore 401 (unauthorized)
  - accesso non consentito se autenticato ma non autorizzato, errore 403 (forbidden) (utente ma non admin) 
+ working testing environment

<br>

+ business level service: geocoding adapter di solito restituisce una bounding box, per ottenere le origin coordinate un servizio di livello business deve fare la media delle coordinate dei punti della bounding box
+ business level service: restituisce lista delle destinazioni le cui coordinate sono contenute nella poligono ottenuto dal range api adapter

<br>

+ api chaching: https://www.npmjs.com/package/apicache middleware (da solo o con redis)

+ eventualmente, image service per le immagini delle destinazioni 

+ eventualmente (all fine di tutto il resto), per sfruttare registrazione utenti, registrare le destinazione che un utente ha gia' visitato e rimuoverle dalla lista delle destinazioni proposte
  - in questo caso, ci sarebbe anche il **nesting di risorse** (destinazioni visitate di un utente), una caratteristica di REST che non abbiamo ancora visto

+ valutare l'utilizzo di NGINX come reverse proxy


## Business logic services:

+ coordinates: talk to geocoding_api_adapter
  - input: location string 
  - response: coordinates

+ bounding box (range): talk to range_api_adapter
  - input: origin_coordinates, entire set of destinations
  - response: filtered set of destinations

  - TO BE CITED IN THE REPORT: Both "/reachable_destinations" and "/destinations/reachable" can be considered RESTful resource names. However, "/destinations/reachable" is more RESTful compliant as it follows the RESTful principle of using hierarchical URIs to represent relationships between resources.

  In REST, resources can be organized into a hierarchy based on their relationships with other resources. By using a hierarchical URI like "/destinations/reachable", it becomes clear that the reachable destinations resource is a subset of the destinations resource, and it helps to maintain a consistent and logical structure for the API.

  On the other hand, "/reachable_destinations" does not indicate any relationship between the reachable destinations resource and the destinations resource, which could make the API less intuitive to use and harder to understand.

  So, "/destinations/reachable" is the more RESTful compliant option.


+ rating destinations: talk to forecast_api_adapter, crowd_api_adapter
  - response: for each destination, a rating

+ bounding box + rating destinations
  - loop through the list of destinations and calculate the rating for each destination




## Report notes

Adapter layer: used for standardizing the data coming from the external APIs. It is used to map the data coming from the external APIs to the data model used in the application. It is also used to map the data coming from the application to the data model used by the external APIs.
mascherare alcune cose come le api key

## Acknowledgements

+ Node.js + Mongoose skeleton: https://github.com/bezkoder

+ GeoCoding (Nominatim): © OpenStreetMap

+ Nominatim self-hosted as a docker container (Not used, too slow startup for the demo test of the project): https://github.com/mediagis/nominatim-docker
