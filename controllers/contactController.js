const ContactService = require("../services/ContactService");
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../utils/constants");

class ContactController {
  static async addContact(req, res) {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({ message: ERROR_MESSAGES.USER_ID_NOT_FOUND_TOKEN });
      }

      let fileData = {};
      if (req.body.fileData) {
        try {
          fileData = JSON.parse(req.body.fileData);
        } catch (error) {
          return res.status(400).json({ message: ERROR_MESSAGES.INVALID_JSON_FILE_DATA_FORMAT });
        }
      }

      const contactData = {
        owner: userId,
        firstName: fileData.firstName,
        lastName: fileData.lastName,
        contactNumber: fileData.contactNumber,
        email: fileData.email,
        profilePhoto: req.file ? `/uploads/${req.file.filename}` : null,
      };

      const result = await ContactService.addContact(contactData);
      res.status(201).json({ message: SUCCESS_MESSAGES.CONTACT_ADDED, contact: result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllContacts(req, res) {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res.status(400).json({ message: ERROR_MESSAGES.USER_ID_NOT_FOUND_TOKEN });
      }

      const users = await ContactService.getAllContacts(userId);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getContact(req, res) {
    try {
      const { id } = req.params;
      const result = await ContactService.getContact(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateContact(req, res) {
    try {
      const { id } = req.params;

      let fileData = {};
      if (req.body.fileData) {
        try {
          fileData = JSON.parse(req.body.fileData);
        } catch (error) {
          return res.status(400).json({ message: ERROR_MESSAGES.INVALID_JSON_FILE_DATA_FORMAT });
        }
      }

      const updatedContactData = {
        firstName: fileData.firstName,
        lastName: fileData.lastName,
        contactNumber: fileData.contactNumber,
        email: fileData.email,
      };

      if (req.file) {
        updatedContactData.profilePhoto = `/uploads/${req.file.filename}`;
      }

      const result = await ContactService.updateContact(id, updatedContactData);
      res.status(200).json({ message: SUCCESS_MESSAGES.CONTACT_UPDATED, contact: result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteContact(req, res) {
    try {
      const { id } = req.params;
      const result = await ContactService.deleteContact(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async shareContact(req, res) {
    try {
      const { users } = req.body;
      const { id } = req.params;
      const result = await ContactService.shareContact(id, users);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async unshareContact(req, res) {
    try {
      const { userId, contactId } = req.body;
      const result = await ContactService.unShareContact(userId, contactId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ContactController;
