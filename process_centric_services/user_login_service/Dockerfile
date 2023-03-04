FROM node:18.14.1

WORKDIR /user_login_service
COPY package.json .
RUN npm install
COPY . .
CMD npm start
