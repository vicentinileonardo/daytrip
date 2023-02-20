const {
    USER_DB_USER,
    USER_DB_PASSWORD,
    USER_DB_HOST,
    USER_DB_DOCKER_PORT,
    USER_DB_NAME,
  } = process.env;
  
module.exports = {
    url: `mongodb://${USER_DB_USER}:${USER_DB_PASSWORD}@${USER_DB_HOST}:${USER_DB_DOCKER_PORT}/${USER_DB_NAME}?authSource=admin`
  };