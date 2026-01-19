require("dotenv").config();
const { Model, DataTypes, Sequelize } = require("sequelize");
const { Auth } = require("../../services/auth.service");
const USER_TABLE = "users";
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const TOKEN = process.env.TOKEN_STRING;

const userConfig = new Auth(SALT_ROUNDS, TOKEN);

const UserModel = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER(11),
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    length: 50,
    unique: true,
  },
  user_name: {
    allowNull: false,
    type: DataTypes.STRING,
    length: 20,
  },
  type_user: {
    type: DataTypes.ENUM("adm", "guest"),
    length: 20,
    allowNull: false,
  },
  token: {
    type: DataTypes.CHAR,
    length: 255,
    allowNull: true,
    defaultValue: userConfig.syncGenHash(),
  },
  token_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  session_logout: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue("active");
      return rawValue === true ? "Yes" : "No";
    },
  },
  password: {
    type: DataTypes.CHAR(255),
    length: 255,
    allowNull: false,
    comment: "Password to store",
  },
  createdAt: {
    defaultValue: Sequelize.fn("CURRENT_TIMESTAMP"),
    allowNull: false,
    type: "timestamp",
    field: "created_at",
  },
  updatedAt: {
    allowNull: true,
    type: "timestamp",
    field: "updated_at",
    defaultValue: Sequelize.fn("NOW"),
    onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
};

class User extends Model {
  static associate(models) {
    // this.hasMany(models.Category);
    // this.hasMany(models.Contact);
    // this.hasMany(models.Message);
    this.hasMany(models.MessageConfig);
    // this.belongsToMany(models.Contact, { through: "UserContacts" });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: "User",
      timestamps: true,
      charset: "utf8",
      paranoid: true,
      collate: "utf8_general_ci",
    };
  }
}

module.exports = { USER_TABLE, UserModel, User };
