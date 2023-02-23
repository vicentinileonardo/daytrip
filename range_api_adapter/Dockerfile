FROM node:18.14.1

WORKDIR /range_api_adapter
COPY package.json .
RUN npm install
COPY . .
CMD npm start
