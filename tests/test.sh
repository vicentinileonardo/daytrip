#!/bin/bash

# Define the name of the service container you want to test
TESTS_FOLDER_PATH="./tests"
SERVICE_NAME="forecast_api_adapter"
DOCKERFILE_PATH="./adapter_services/$SERVICE_NAME"

# Define the name of the test container
TEST_CONTAINER_NAME="test_$SERVICE_NAME"

# Build the Docker image from the Dockerfile
docker build -t $SERVICE_NAME $DOCKERFILE_PATH

# Start a new container based on the same image as the service container
docker run --name $TEST_CONTAINER_NAME \
            --network=host \
            -p 16870:8080 \
            --env-file ./.env \
            -e NODE_ENV=test \
            -e PROVA=prova \
            -d $SERVICE_NAME 
            
# Copy your test files into the container
docker cp $TESTS_FOLDER_PATH $TEST_CONTAINER_NAME:/$SERVICE_NAME/

#stop node server due to port conflict
docker exec $TEST_CONTAINER_NAME sh -c 'pkill -f "node /forecast_api_adapter/server.js"'

# Run your tests inside the container
#docker exec $TEST_CONTAINER_NAME npm test

<<comment
# Remove the test container
docker rm -f $TEST_CONTAINER_NAME
comment
