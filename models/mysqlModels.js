const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const SharedContacts = sequelize.define("SharedContacts", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  contactId: { type: DataTypes.STRING, allowNull: false },
});

module.exports = { SharedContacts };
