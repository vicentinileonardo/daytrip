FROM node:18.14.1

WORKDIR /forecast_api_adapter
COPY package.json .
RUN npm install
COPY . .
CMD npm start
