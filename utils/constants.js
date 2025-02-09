const ERROR_MESSAGES = {
  USER_EXISTS: "Email already exists",
  USER_NOT_FOUND: "User not found",
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_APPROVED: "User not approved by admin yet",
  REGISTRATION_FAILED: "User registration failed at MySQL step.",
  APPROVER_FORBIDDEN: "Forbidden: Only admin or super-admin can approve users.",
  CONTACT_NOT_FOUND: "Contact not found",
  USER_ID_NOT_FOUND_TOKEN: "User ID not found in token",
  SHARED_CONTACT_NOT_FOUND: "Shared contact not found",
  NO_VALID_USERS: "No valid users",
  PASSWORDS_DO_NOT_MATCH: "New password and confirm password do not match",
  INVALID_OR_EXPIRED_TOKEN: "Invalid or expired password reset token",
  INVALID_JSON_FILE_DATA_FORMAT: "Invalid fileData JSON format",
};

const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: "User registered. Awaiting admin approval.",
  USER_APPROVED: "User approved successfully!",
  USER_DEACTIVATED: "User deactivated successfully!",
  PASSWORD_RESET: "Password reset link sent to your email.",
  USER_UPDATED: "User updated successfully.",
  USER_DELETED: "User deleted successfully.",
  CONTACT_ADDED: "Contact added successfully.",
  CONTACT_UPDATED: "Contact updated successfully.",
  CONTACT_DELETED: "Contact deleted successfully.",
  CONTACT_SHARED: "Contact has been successfully shared",
  CONTACT_UNSHARED: "Contact has been successfully unshared",
  PASSWORD_UPDATED: "Password has been successfully updated",
};

const USER_STATUS = {
  APPROVED: "approved",
  PENDING: "pending",
  DEACTIVATED: "deactivated",
};

const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  SUPER_ADMIN: "super-admin",
};

module.exports = { ERROR_MESSAGES, SUCCESS_MESSAGES, USER_STATUS, USER_ROLES };
