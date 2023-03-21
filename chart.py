from diagrams import Diagram, Cluster, Edge

from diagrams.onprem.database import MongoDB

from diagrams.programming.language import NodeJS
from diagrams.programming.framework import Flask

from diagrams.onprem.network import Nginx

graph_attr = {
    "fontsize": "35",
    "bgcolor": "transparent",
    "center": "true"
}

with Diagram("Daytrip", show=False, direction="TB", graph_attr=graph_attr):

    with Cluster("Presentation Layer"):
        nginx = Nginx("nginx")

        with Cluster("Process Centric Layer"):
            best_destinations_service = Flask("Best Destinations Service")
            user_login_service = NodeJS("User Login Service")
            user_registration_service = Flask("User Registration Service")
        
        with Cluster("Business Logic Layer"):
            coordinates_rating_service = NodeJS("Coordinates Rating Service")
            coordinates_service = Flask("Coordinates Service")
            reachable_destinations_service = Flask("Reachable Destinations Service")
            valid_email_service = Flask("Valid Email Service")
        
        with Cluster("Adapter Layer"):
            air_pollution_api_adapter = Flask("Air Pollution API Adapter")
            crowd_api_adapter = NodeJS("Crowd API Adapter")
            destination_db_adapter = NodeJS("Destination DB Adapter")
            emailcheck_api_adapter = Flask("Emailcheck API Adapter")
            forecast_api_adapter = NodeJS("Forecast API Adapter")
            geocoding_api_adapter = Flask("Geocoding API Adapter")
            ip_api_adapter = Flask("IP API Adapter")
            range_api_adapter = NodeJS("Range API Adapter")
            user_db_adapter = NodeJS("User DB Adapter")

        data_layer_cluster_attr = {
            "fillcolor": "#43de7b",
            "style": "filled",
        }
        with Cluster("Data Layer", graph_attr=data_layer_cluster_attr):
            user_db = MongoDB("user_db")
            destination_db = MongoDB("destination_db")
        
        user_registration_service >> Edge(color="darkgreen") << valid_email_service
        valid_email_service >> Edge(color="darkgreen") << emailcheck_api_adapter
        user_db_adapter >> Edge(color="darkgreen") << user_db
        destination_db_adapter >> Edge(color="darkgreen") << destination_db
  