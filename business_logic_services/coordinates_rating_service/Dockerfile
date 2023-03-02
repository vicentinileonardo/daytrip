FROM node:18.14.1

WORKDIR /coordinates_rating_service
COPY package.json .
RUN npm install
COPY . .
CMD npm start
