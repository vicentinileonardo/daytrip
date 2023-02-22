FROM node:18.14.1

WORKDIR /weather_api_adapter
COPY package.json .
RUN npm install
COPY . .
CMD npm start
