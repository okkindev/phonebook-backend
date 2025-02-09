require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectMongoDB } = require("./config/db");
const { syncDatabase } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

// Serve uploaded profile photos statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);

//Connect MongoDB and MySQL
connectMongoDB();
syncDatabase();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
