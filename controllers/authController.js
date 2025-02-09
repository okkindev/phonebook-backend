const AuthService = require("../services/AuthService");

class AuthController {
  static async registerUser(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const result = await AuthService.registerUser(firstName, lastName, email, password);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.loginUser(email, password);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, newPassword, confirmPassword } = req.body;
      const result = await AuthService.resetPassword(token, newPassword, confirmPassword);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AuthController;
