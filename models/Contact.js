const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  firstName: String,
  lastName: String,
  contactNumber: String,
  email: String,
  profilePhoto: String,
});

module.exports = mongoose.model("Contact", ContactSchema);
