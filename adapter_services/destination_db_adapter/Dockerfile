FROM node:18.14.1

WORKDIR /destination_db_adapter
COPY package.json .
RUN npm install
COPY . .
CMD npm start
