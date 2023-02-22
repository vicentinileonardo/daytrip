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


## TODO

+ controllare versione mongoose
+ integrazione con graphql nel destination_db_adapter
+ DOCUMENTAZIONE API
+ ERRORI 404
+ geocoding adapter di solito restituisce una bounding box, per ottenere le origin coordinate un servizio di livello business deve fare la media delle coordinate dei punti della bounding box


## Acknowledgements

+ Node.js + Mongoose skeleton: https://github.com/bezkoder

+ GeoCoding (Nominatim): © OpenStreetMap

+ Nominatim self-hosted as a docker container (Not used, too slow startup for the demo test): https://github.com/mediagis/nominatim-docker
