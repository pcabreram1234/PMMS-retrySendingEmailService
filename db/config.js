const { config } = require("../config/config");
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.password);

const URI = `mysql://${USER}:${PASSWORD}@${config.host}:${config.port}/${config.database}`;

module.exports = {
  development: {
    url: URI,
    dialect: config.dialect,
  },
  production: {
    url: URI,
    dialect: config.dialect,
  },
};
