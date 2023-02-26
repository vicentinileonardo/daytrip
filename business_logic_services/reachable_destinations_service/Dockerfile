# Use a lightweight Alpine Linux distribution with Python 3.9
FROM python:3.9-alpine

# Set the working directory
WORKDIR /reachable_destinations_service
COPY requirements.txt requirements.txt

# Install required packages and dependencies for NumPy and Matplotlib
RUN apk update && apk add --no-cache \
    python3-dev \
    build-base \
    gfortran \
    freetype-dev \
    libpng-dev \
    openblas-dev

RUN pip3 install -r requirements.txt

# Copy the application code to the container
COPY . .

# Expose port 8080
EXPOSE 8080

# Run the Flask application
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=8080"]
