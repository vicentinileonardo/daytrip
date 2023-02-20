FROM node:18.14.1

WORKDIR /user_db_adapter
COPY package.json .
RUN npm install
COPY . .
CMD npm start
