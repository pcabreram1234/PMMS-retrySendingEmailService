// src/db/sequelize.js
require("dotenv").config();
const { Sequelize } = require("sequelize");
const { config } = require("../config/config");
const { setupModels } = require("../db/models/index");

let sequelizeInstance = null;

function createSequelizeInstance() {
  const USER = encodeURIComponent(config.dbUser);
  const PASSWORD = encodeURIComponent(config.password);
  const URI = `mysql://${USER}:${PASSWORD}@${config.host}:${config.port}/${config.database}`;

  return new Sequelize(URI, {
    dialect: config.dialect,
    timezone: "-04:00",
    logging: false,
    pool: {
      max: 1,        // Ideal para Lambda: máximo 1 conexión por ejecución
      min: 0,
      idle: 10000,
      evict: 15000,
      acquire: 10000,
    },
    retry: {
      max: 3,
      match: [
        /ECONNRESET/,
        /SequelizeConnectionError/,
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ESOCKETTIMEDOUT/,
        /ECONNREFUSED/,
      ],
    },
    define: {
      timestamps: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function initSequelize() {
  if (!sequelizeInstance) {
    const sequelize = createSequelizeInstance();
    setupModels(sequelize);

    try {
      await sequelize.authenticate();
      console.log("✅ Database connected.");
    } catch (error) {
      console.error("❌ Database connection error:", error);
      throw error;
    }

    // Solo en desarrollo sincroniza los modelos automáticamente
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({
        alter: false,
        force: false,
        logging: console.log,
      });
    }

    sequelizeInstance = sequelize;
  }

  return sequelizeInstance;
}

module.exports = { initSequelize };
