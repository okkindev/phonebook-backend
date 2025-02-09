const mongoose = require("mongoose");
const { USER_ROLES, USER_STATUS } = require("../utils/constants");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.USER },
  status: { type: String, enum: Object.values(USER_STATUS), default: USER_STATUS.PENDING },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("User", UserSchema);
