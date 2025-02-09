const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const UserService = require("../services/UserService");
const EmailService = require("./EmailService");
const { ERROR_MESSAGES, SUCCESS_MESSAGES, USER_STATUS } = require("../utils/constants");

class AuthService {
  static async registerUser(firstName, lastName, email, password) {
    try {
      return await UserService.createUser(firstName, lastName, email, password);
    } catch (error) {
      throw error;
    }
  }

  static async loginUser(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);

    if (user.status !== USER_STATUS.APPROVED) throw new Error(ERROR_MESSAGES.USER_NOT_APPROVED);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_TOKEN_EXPIRE,
      }
    );

    return { accessToken };
  }

  static async forgotPassword(email) {
    const user = await UserRepository.findByEmail(email);

    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TOKEN_EXPIRE,
    });

    await EmailService.sendPasswordResetEmail(email, resetToken);

    return { message: SUCCESS_MESSAGES.PASSWORD_RESET };
  }

  static async resetPassword(token, newPassword, confirmPassword) {
    try {
      if (newPassword !== confirmPassword) {
        throw new Error(ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserRepository.findById(decoded.id);

      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserRepository.updateUserById(user._id, { password: hashedPassword });

      return { message: SUCCESS_MESSAGES.PASSWORD_UPDATED };
    } catch (error) {
      throw new Error(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    }
  }
}

module.exports = AuthService;
