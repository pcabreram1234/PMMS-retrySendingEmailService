const { DataTypes, Model } = require("sequelize");
const FAILED_MESSAGE_TABLE = "failed_messages";

const FailedMessageModel = {
  id: {
    type: DataTypes.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  message_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "messages", // Asume que tienes una tabla 'messages' a la cual haces referencia
      key: "id",
    },
    onDelete: "CASCADE",
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users", // Asume que tienes una tabla 'users' a la cual haces referencia
      key: "id",
    },
    onDelete: "CASCADE",
  },
  recipient: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message_content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  scheduled_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(
      "Pending",
      "Error",
      "Permanent Failure",
      "Retrying",
      "Sended"
    ),
    allowNull: false,
    defaultValue: "Pending",
  },
  last_attempt_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  next_retry_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
};

class FailedMessage extends Model {
  static associate(models) {}

  static config(sequelize) {
    return {
      sequelize,
      tableName: FAILED_MESSAGE_TABLE,
      modelName: "FailedMessage",
      timestamps: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      paranoid: true,
    };
  }
}

module.exports = { FailedMessageModel, FailedMessage };
