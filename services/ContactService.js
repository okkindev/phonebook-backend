const { sequelize } = require("../config/db");
const ContactRepository = require("../repositories/ContactRepository");
const SharedContactsRepository = require("../repositories/SharedContactsRepository");
const UserRepository = require("../repositories/UserRepository");
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../utils/constants");

class ContactService {
  static async addContact(contactData) {
    await ContactRepository.create(contactData);
    return { message: SUCCESS_MESSAGES.CONTACT_ADDED, contact: contactData };
  }

  static async getAllContacts(owner) {
    const ownedContacts = await ContactRepository.findAll({ owner });

    const sharedContacts = await SharedContactsRepository.findAllByFilter({
      userId: owner.toString(),
    });

    const sharedContactDetails = await Promise.all(
      sharedContacts.map(async (sc) => {
        const shared = await ContactRepository.findById(sc.dataValues.contactId);
        return shared ? (shared.toObject ? shared.toObject() : shared) : null;
      })
    );

    const filteredSharedContacts = sharedContactDetails.filter((contact) => contact !== null);

    return [...ownedContacts, ...filteredSharedContacts];
  }

  static async getContact(contactId) {
    const contact = await ContactRepository.findById(contactId);
    if (!contact) throw new Error(ERROR_MESSAGES.CONTACT_NOT_FOUND);

    const contactData = contact.toObject ? contact.toObject() : { ...contact };

    delete contactData.__v;

    const sharedContacts = await SharedContactsRepository.findAllByFilter({
      contactId: contact._id.toString(),
    });

    contactData.sharedTo = await Promise.all(
      sharedContacts.map(async (sc) => {
        const user = await UserRepository.findById(sc.dataValues.userId);
        if (user) {
          const userData = user.toObject ? user.toObject() : { ...user };
          delete userData.__v;
          delete userData.password;
          return userData;
        }
        return null;
      })
    );

    contactData.sharedTo = contactData.sharedTo.filter((user) => user !== null);

    return contactData;
  }

  static async updateContact(contactId, updateData) {
    const contact = await ContactRepository.findById(contactId);
    if (!contact) throw new Error(ERROR_MESSAGES.CONTACT_NOT_FOUND);

    await ContactRepository.updateContactById(contactId, updateData);
    return { message: SUCCESS_MESSAGES.CONTACT_UPDATED };
  }

  static async deleteContact(contactId) {
    const contact = await ContactRepository.findById(contactId);
    if (!contact) throw new Error(ERROR_MESSAGES.CONTACT_NOT_FOUND);

    await ContactRepository.deleteContactById(contactId);
    return { message: SUCCESS_MESSAGES.CONTACT_DELETED };
  }

  static async shareContact(contactId, users) {
    try {
      const contact = await ContactRepository.findById(contactId);
      if (!contact) throw new Error(ERROR_MESSAGES.CONTACT_NOT_FOUND);

      const validUserIds = await Promise.all(
        users.map(async (userId) => {
          const userExists = await UserRepository.findById(userId);
          return userExists ? userId : null;
        })
      );

      const filteredUserIds = validUserIds.filter((userId) => userId !== null);

      if (filteredUserIds.length === 0) {
        throw new Error(ERROR_MESSAGES.NO_VALID_USERS);
      }

      await Promise.all(
        filteredUserIds.map(async (userId) => {
          await SharedContactsRepository.createSharedContact(userId, contactId);
        })
      );

      return { message: SUCCESS_MESSAGES.CONTACT_SHARED };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async unShareContact(userId, contactId) {
    const transaction = await sequelize.transaction();
    try {
      const contact = await ContactRepository.findById(contactId);
      if (!contact) {
        throw new Error(ERROR_MESSAGES.CONTACT_NOT_FOUND);
      }

      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const result = await SharedContactsRepository.deleteSharedContact(
        userId,
        contactId,
        transaction
      );

      if (result === 0) {
        throw new Error(ERROR_MESSAGES.SHARED_CONTACT_NOT_FOUND);
      }

      await transaction.commit();
      return { message: SUCCESS_MESSAGES.CONTACT_UNSHARED };
    } catch (error) {
      await transaction.rollback();
      throw new Error(error.message);
    }
  }
}

module.exports = ContactService;
