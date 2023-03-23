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
    

    
    boundary_points = [(0,0), (0,2), (2,2), (2,0)]
    origin_point = (4,4)
    
    path = mplPath.Path(boundary_points)
    origin_in_polygon = path.contains_points([origin_point])
    print(origin_in_polygon)
    
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

