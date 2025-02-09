const mongoose = require("mongoose");
const mysql = require("mysql2");
const { Sequelize } = require("sequelize");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const sequelize = new Sequelize(
  process.env.MYSQL_DB_NAME,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    port: process.env.MYSQL_PORT,
    logging: false,
  }
);

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("MySQL Database Synced!");
  } catch (error) {
    console.error("Database Sync Error:", error.message);
  }
};

module.exports = { connectMongoDB, sequelize, syncDatabase };
