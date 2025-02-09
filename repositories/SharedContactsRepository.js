const { SharedContacts } = require("../models/mysqlModels");

class SharedContactsRepository {
  static async createSharedContact(userId, contactId, transaction) {
    return await SharedContacts.create({ userId, contactId }, { transaction });
  }

  static async findAllByFilter(filter) {
    return await SharedContacts.findAll({ where: filter });
  }

  static async deleteSharedContact(userId, contactId, transaction) {
    return await SharedContacts.destroy({
      where: { userId, contactId },
      transaction,
    });
  }
}

module.exports = SharedContactsRepository;
