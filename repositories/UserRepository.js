const User = require("../models/User");

class UserRepository {
  static async findByEmail(email) {
    return await User.findOne({ email });
  }

  static async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  static async deleteUserById(userId) {
    return await User.findByIdAndDelete(userId);
  }

  static async findAll(search) {
    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    return await User.find(query);
  }

  static async findById(userId) {
    return await User.findById(userId);
  }

  static async updateUserById(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }
}

module.exports = UserRepository;
