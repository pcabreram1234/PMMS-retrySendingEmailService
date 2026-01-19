require("dotenv").config();
const { MessageConfig, MessageConfigModel } = require("./MessageCofing");
const { USER_TABLE, User, UserModel } = require("./Users");
const { FailedMessage, FailedMessageModel } = require("./FailedMessages");

async function setupModels(sequelize) {
  User.init(UserModel, User.config(sequelize));
  MessageConfig.init(MessageConfigModel, MessageConfig.config(sequelize));
  FailedMessage.init(FailedMessageModel, FailedMessage.config(sequelize));

  /* Relations setup */
  User.associate(sequelize.models);
  MessageConfig.associate(sequelize.models);
}

module.exports = { setupModels };
