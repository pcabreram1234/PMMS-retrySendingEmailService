require("dotenv").config();
const config = {
  
  dialect: process.env.DIALECTDB,
  database: process.env.MYSQLDATABASE,
  host: process.env.MYSQLHOST,
  password: process.env.MYSQLPASSWORD,
  port: process.env.MYSQLPORT,
  dbUser: process.env.MYSQLUSER,
  logging: true,
};

module.exports = { config };
