require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db");
const UserRepository = require("../repositories/UserRepository");
const { ERROR_MESSAGES, SUCCESS_MESSAGES, USER_STATUS, USER_ROLES } = require("../utils/constants");

class UserService {
  static async getAllUsers(search) {
    return await UserRepository.findAll(search);
  }

  static async getUser(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

    return user;
  }

  static async approveUser(userId, userRole) {
    // Only allow super-admin or admin
    if (![USER_ROLES.USER, USER_ROLES.SUPER_ADMIN].includes(userRole)) {
      const error = new Error(ERROR_MESSAGES.APPROVER_FORBIDDEN);
      error.statusCode = 403;
      throw error;
    }

    const user = await UserRepository.findById(userId);
    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

    if (user.status !== USER_STATUS.PENDING) {
      throw new Error(`User is ${user.status}`);
    }

    await UserRepository.updateUserById(userId, { status: USER_STATUS.APPROVED });
    return { message: SUCCESS_MESSAGES.USER_APPROVED };
  }

  static async deactivateUser(userId, userRole) {
    // Only allow super-admin or admin
    if (![USER_ROLES.USER, USER_ROLES.SUPER_ADMIN].includes(userRole)) {
      const error = new Error(ERROR_MESSAGES.APPROVER_FORBIDDEN);
      error.statusCode = 403;
      throw error;
    }

    const user = await UserRepository.findById(userId);
    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

    await UserRepository.updateUserById(userId, {
      status: USER_STATUS.DEACTIVATED,
      isActive: false,
    });
    return { message: SUCCESS_MESSAGES.USER_DEACTIVATED };
  }

  static async createUser(firstName, lastName, email, password = null) {
    const existingUser = await UserRepository.findByEmail(email);

    if (existingUser) throw new Error(ERROR_MESSAGES.USER_EXISTS);

    const hashedPassword = await bcrypt.hash(password || process.env.DEFAULT_USER_PASSWORD, 10);

    await UserRepository.create({ firstName, lastName, email, password: hashedPassword });
    return { message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS };
  }

  static async updateUser(userId, updateData) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

    await UserRepository.updateUserById(userId, updateData);
    return { message: SUCCESS_MESSAGES.USER_UPDATED };
  }

  static async deleteUser(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

    await UserRepository.deleteUserById(userId);
    return { message: SUCCESS_MESSAGES.USER_DELETED };
  }
}

module.exports = UserService;
