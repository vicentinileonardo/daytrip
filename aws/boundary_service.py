import json
import matplotlib.path as mplPath

def lambda_handler(event, context):
    
    http_method = event['httpMethod']
    if http_method == 'GET':
        return handle_get(event)
    elif http_method == 'POST':
        return handle_post(event)
    elif http_method == 'PUT':
        return handle_put(event)
    elif http_method == 'DELETE':
        return handle_delete(event)
    else:
        return {
            'statusCode': 405,
            'body': json.dumps('Method not allowed')
        }

def handle_get(event):

    body = json.loads(event['body'])

    boundary_points = body['boundary_points']
    origin_point = body['origin_point']
    destinations = body['destinations']

    
    
    path = mplPath.Path(boundary_points)
    origin_in_polygon = path.contains_points([origin_point])

    # if origin is not inside polygon
    if not origin_in_polygon:
        response = {
            "status": "fail",
            "data": {"destinations": "The origin is not inside the range, weird because the range was calculated using the origin"}
        }
        return response, 500

    # check every destination if it is inside the range
    reachable_destinations = []
    for destination in destinations:
        destination_point = (destination.get("coordinates").get("lat"), destination.get("coordinates").get("lon"))        
        destination_in_polygon = path.contains_points([destination_point])
        if destination_in_polygon:
            reachable_destinations.append(destination)

    

    
    return {
        'statusCode': 200,
        'body': json.dumps('hi')
    }

def handle_post(event):
    return {
        'statusCode': 405,
        'body': json.dumps('Method not allowed')
    }

def handle_put(event):
    return {
        'statusCode': 405,
        'body': json.dumps('Method not allowed')
    }

def handle_delete(event):
    return {
        'statusCode': 405,
        'body': json.dumps('Method not allowed')
    }

