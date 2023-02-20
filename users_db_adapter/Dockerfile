FROM node:14

WORKDIR /users_db_adapter
COPY package.json .
RUN npm install
COPY . .
CMD npm start
