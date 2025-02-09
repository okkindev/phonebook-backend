const Contact = require("../models/Contact");

class ContactRepository {
  static async create(contactData) {
    const contact = new Contact(contactData);
    return await contact.save();
  }

  static async findAll(filter = {}) {
    return await Contact.find(filter);
  }

  static async findById(contactId) {
    return await Contact.findById(contactId);
  }

  static async updateContactById(contactId, updateData) {
    return await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
  }

  static async deleteContactById(contactId) {
    return await Contact.findByIdAndDelete(contactId);
  }
}

module.exports = ContactRepository;
