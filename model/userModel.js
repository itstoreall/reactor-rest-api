const UserSchema = require('./schemas/userSchema');

// Find User by ID
const findById = async id => {
  return await UserSchema.findOne({ _id: id });
};

// Find User by Email
const findByEmail = async email => {
  return await UserSchema.findOne({ email });
};

// Create User
const create = async options => {
  const user = new UserSchema(options);
  return await user.save();
};

// Update Token
const updateToken = async (id, token) => {
  return await UserSchema.updateOne({ _id: id }, { token });
};

// Update Avatar
const updateAvatar = async (id, avatar) => {
  return await UserSchema.updateOne({ _id: id }, { avatar });
};

module.exports = {
  findById,
  findByEmail,
  create,
  updateToken,
  updateAvatar,
};

/**
 * userModel - Repository
 */
