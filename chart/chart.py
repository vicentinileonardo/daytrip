from diagrams import Diagram, Cluster, Edge
from diagrams.custom import Custom

from diagrams.onprem.database import MongoDB

from diagrams.programming.language import NodeJS
from diagrams.programming.framework import Flask

from diagrams.onprem.network import Nginx

from diagrams.aws.compute import Lambda
from diagrams.aws.network import APIGateway

graph_attr = {
    "size": "100,100",
    "fontsize": "75",
    "center": "true",
    "bgcolor": "transparent",
    
    
}



with Diagram("Daytrip", show=False, direction="TB", graph_attr=graph_attr, filename="daytrip", outformat=["png","svg"]):

    cluster_attr = {
        "margin": "30",
        "nodesep": "1.0",
        #"ranksep": "1.0",
        #"bgcolor": "transparent",
        #"style": "filled",
        "fillcolor": "#f0f0f0",
        #"color": "transparent",
        "fontcolor": "black",
        "fontsize": "75",
        "labeljust": "l",
        "labelloc": "t",
        "label": "Daytrip",
        "fontname": "Helvetica",
        "penwidth": "0.0",
        #"rankdir": "TB",
        #"rank": "same",
        #"splines": "ortho",


    }
    with Cluster("Nginx", graph_attr=cluster_attr):
        nginx = Nginx("nginx")
        
        with Cluster("Presentation Layer"):
            with Cluster("Static files"):
                static_files = Custom("", "./chart/html_css_js.png")
        

        with Cluster("Process Centric Layer"):
            with Cluster("User Login Service"):
                user_login_service = NodeJS("NodeJS + Express")
            with Cluster("Best Destinations Service"):
                best_destinations_service = Flask("Python + Flask")
            with Cluster("User Registration Service"):
                user_registration_service = Flask("Python + Flask")
        
        with Cluster("Business Logic Layer", graph_attr={"rank": "same"}):
            with Cluster("Coordinates Rating Service"):
                coordinates_rating_service = NodeJS("NodeJS + Express")
            with Cluster("Coordinates Service"):
                coordinates_service = Flask("Python + Flask")
            
            with Cluster("Valid Email Service"):
                valid_email_service = Flask("Python + Flask")

            with Cluster("Reachable Destinations Service"):
                reachable_destinations_service = Flask("Python + Flask")
            
            with Cluster("AWS"):
                with Cluster("Boundary service", graph_attr={"rank": "same"}):
                    boundary_service_api = APIGateway("API Gateway")
                    boundary_service_lambda = Lambda("Lambda function")
                    #boundary_service_api - boundary_service_lambda
                    
        
        with Cluster("Adapter Layer"):
            
            
            
            
            
            with Cluster("Destination DB Adapter"):
                destination_db_adapter = NodeJS("NodeJS + Express")
            
            with Cluster("Emailcheck API Adapter"):
                emailcheck_api_adapter = Flask("Python + Flask")
            
            with Cluster("Crowd API Adapter"):
                crowd_api_adapter = NodeJS("NodeJS + Express")

            with Cluster("Air Pollution API Adapter"):
                air_pollution_api_adapter = Flask("Python + Flask")

            with Cluster("Forecast API Adapter"):       
                forecast_api_adapter = NodeJS("NodeJS + Express")

            with Cluster("Geocoding API Adapter"):
                geocoding_api_adapter = Flask("Python + Flask")
            
            with Cluster("IP API Adapter"):
                ip_api_adapter = Flask("Python + Flask")

            with Cluster("Range API Adapter"):
                range_api_adapter = NodeJS("NodeJS + Express")

            with Cluster("User DB Adapter"):
                user_db_adapter = NodeJS("NodeJS + Express")

        
        data_layer_cluster_attr = {
            "fillcolor": "#f0f0f0",
            "style": "filled",
            "outputorder": "edgesfirst",
            "overlap_scaling": "1.0",
        }
        with Cluster("Data Layer", graph_attr=data_layer_cluster_attr):
            
            with Cluster("Destination DB"):
                destination_db = MongoDB("(MongoDB)")

            with Cluster("User DB"):
                user_db = MongoDB("(MongoDB)")
            
            with Cluster("TomTom API"):
                tomtom_api = Custom("", "./chart/TomTom.png")
            
            with Cluster("Weather API"):
                weather_api = Custom("", "./chart/weather_api.png")
            
            with Cluster("OpenStreetMap API"):
                openstreetmap_api = Custom("", "./chart/osm.png")

            with Cluster("EVA API"):
                eva_api = Custom("", "./chart/eva.png")

            with Cluster("IP API"):
                ip_api = Custom("", "./chart/ip-api.png")
            
            with Cluster("ipify API"):
                ipify = Custom("", "./chart/ipify.png")
            
            with Cluster("OpenWeatherMap API"):
                owm = Custom("", "./chart/owm.png")
            
            with Cluster("Google Maps"):
                google_maps = Custom("", "./chart/google_maps.png")
            
        
        static_files >> Edge(color="darkgreen") << user_registration_service
        static_files >> Edge(color="darkgreen") << user_login_service
        static_files >> Edge(color="darkgreen") << best_destinations_service
        static_files >> Edge(color="darkgreen") << google_maps
        static_files >> Edge(color="darkgreen") << ipify

        # process centric layer
        best_destinations_service >> Edge(color="darkgreen") << coordinates_service
        best_destinations_service >> Edge(color="darkgreen") << reachable_destinations_service
        best_destinations_service >> Edge(color="darkgreen") << coordinates_rating_service

        user_login_service >> Edge(color="darkgreen") << user_db_adapter

        user_registration_service >> Edge(color="darkgreen") << valid_email_service
        user_registration_service >> Edge(color="darkgreen") << coordinates_service
        user_registration_service >> Edge(color="darkgreen") << user_db_adapter

        # business logic layer
        coordinates_rating_service >> Edge(color="darkgreen") << forecast_api_adapter
        coordinates_rating_service >> Edge(color="darkgreen") << crowd_api_adapter
        coordinates_rating_service >> Edge(color="darkgreen") << air_pollution_api_adapter

        coordinates_service >> Edge(color="darkgreen") << geocoding_api_adapter

        reachable_destinations_service >> Edge(color="darkgreen") << destination_db_adapter
        reachable_destinations_service >> Edge(color="darkgreen") << range_api_adapter
        #reachable_destinations_service - boundary_service_api

        valid_email_service >> Edge(color="darkgreen") << emailcheck_api_adapter



        



        # adapter layer
        
        air_pollution_api_adapter >> Edge(color="darkgreen") << owm
        crowd_api_adapter >> Edge(color="darkgreen") << tomtom_api
        
        emailcheck_api_adapter >> Edge(color="darkgreen") << eva_api
        forecast_api_adapter >> Edge(color="darkgreen") << weather_api
        geocoding_api_adapter >> Edge(color="darkgreen") << openstreetmap_api
        ip_api_adapter >> Edge(color="darkgreen") << ip_api
        range_api_adapter >> Edge(color="darkgreen") << tomtom_api
        destination_db_adapter >> Edge(color="darkgreen") << destination_db
        user_db_adapter >> Edge(color="darkgreen") << user_db
        




        
        
        
