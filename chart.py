from diagrams import Diagram, Cluster, Edge

from diagrams.onprem.database import MongoDB

from diagrams.programming.language import NodeJS
from diagrams.programming.framework import Flask

from diagrams.onprem.network import Nginx

graph_attr = {
    "fontsize": "35",
    "bgcolor": "transparent"
}

with Diagram("Daytrip", show=False, direction="TB", graph_attr=graph_attr, filename="daytrip"):

    with Cluster("Nginx"):
        nginx = Nginx("nginx")
        
        with Cluster("Presentation Layer"):
            static_files = Nginx("Static Files")
        

        with Cluster("Process Centric Layer"):
            with Cluster("User Login Service"):
                user_login_service = NodeJS("NodeJS + Express")
            with Cluster("Best Destinations Service"):
                best_destinations_service = Flask("Python + Flask")
            with Cluster("User Registration Service"):
                user_registration_service = Flask("Python + Flask")
        
        with Cluster("Business Logic Layer"):
            with Cluster("Coordinates Rating Service"):
                coordinates_rating_service = NodeJS("NodeJS + Express")
            with Cluster("Coordinates Service"):
                coordinates_service = Flask("Python + Flask")
            with Cluster("Reachable Destinations Service"):
                reachable_destinations_service = Flask("Python + Flask")
            with Cluster("Valid Email Service"):
                valid_email_service = Flask("Python + Flask")
        
        with Cluster("Adapter Layer"):
            
            with Cluster("Air Pollution API Adapter"):
                air_pollution_api_adapter = Flask("Python + Flask")
            
            with Cluster("Crowd API Adapter"):
                crowd_api_adapter = NodeJS("NodeJS + Express")
            
            with Cluster("Destination DB Adapter"):
                destination_db_adapter = NodeJS("NodeJS + Express")
            
            with Cluster("Emailcheck API Adapter"):
                emailcheck_api_adapter = Flask("Python + Flask")

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
        }
        with Cluster("Data Layer", graph_attr=data_layer_cluster_attr):
            with Cluster("User DB"):
                user_db = MongoDB("MongoDB")
            with Cluster("Destination DB"):
                destination_db = MongoDB("MongoDB")
        
        static_files >> Edge(color="darkgreen") << user_registration_service

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







        
        valid_email_service >> Edge(color="darkgreen") << emailcheck_api_adapter
        user_db_adapter >> Edge(color="darkgreen") << user_db
        destination_db_adapter >> Edge(color="darkgreen") << destination_db
