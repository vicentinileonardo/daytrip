FROM python:3.9-alpine
WORKDIR /valid_email_service
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . . 
EXPOSE 8080
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=8080"]
