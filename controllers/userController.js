const UserService = require("../services/UserService");

class UserController {
  static async getAllUsers(req, res) {
    try {
      const { search } = req.query;
      const users = await UserService.getAllUsers(search);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUser(req, res) {
    try {
      const { id } = req.params;
      const result = await UserService.getUser(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async approveUser(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.user;

      const result = await UserService.approveUser(id, role);
      res.json(result);
    } catch (error) {
      res.status(403).json({ message: error.message });
    }
  }

  static async deactivateUser(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.user;
      const result = await UserService.deactivateUser(id, role);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createUser(req, res) {
    try {
      const { firstName, lastName, email } = req.body;
      const result = await UserService.createUser(firstName, lastName, email);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const result = await UserService.updateUser(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await UserService.deleteUser(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserController;
