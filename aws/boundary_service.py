import json
import matplotlib.path as mplPath

def lambda_handler(event, context):
    
    http_method = event['httpMethod']

    if http_method == 'GET':
        return handle_get(event)
    elif http_method == 'POST':
        return handle_post(event)
    else:
        response = {
                "status": "fail",
                "data": {"destinations": "Method not allowed"}
            }
        return {
            'statusCode': 405,
            'body': json.dumps(response)
        }
        
def handle_get(event):
    response = {
                "status": "success",
                "message": "boundary service is up and running!"
            }
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }
    

def handle_post(event):
    
    try:
        body = event.get('body')
        body_dict = json.loads(body)
        boundary_points = body_dict.get('boundary_points')
        origin_point = body_dict.get('origin_point')
        destinations = body_dict.get('destinations')
    
        if not boundary_points or not origin_point or not destinations:
            response = {
                "status": "fail",
                "data": {"destinations": "Missing parameters"}
            }
            return {
                'statusCode': 500,
                'body': json.dumps(response)
            }
        
        path = mplPath.Path(boundary_points)
        origin_in_polygon = path.contains_points([origin_point])
    
        # if origin is not inside polygon
        if not origin_in_polygon:
            response = {
                "status": "fail",
                "data": {"destinations": "The origin is not inside the range, weird because the range was calculated using the origin"}
            }
            return {
                'statusCode': 500,
                'body': json.dumps(response)
            }
        
        reachable_destinations = []
        for destination in destinations:
            destination_point = (destination.get("coordinates").get("lat"), destination.get("coordinates").get("lon"))
            destination_in_polygon = path.contains_points([destination_point])
            if destination_in_polygon:
                reachable_destinations.append(destination)
    
        response = {
            "status": "success",
            "data": {"destinations": reachable_destinations}
        }
    
        return {
            'statusCode': 200,
            'body': json.dumps(response)
        }
    except:
        response = {
                "status": "fail",
                "data": {"destinations": "Provided malformed body"}
            }
        return {
            'statusCode': 200,
            'body': json.dumps(response)
        }
        
