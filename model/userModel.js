const UserSchema = require('./schemas/userSchema');

const findById = async id => {
  return await UserSchema.findOne({ _id: id });
};

const findByEmail = async email => {
  return await UserSchema.findOne({ email });
};

const create = async options => {
  const user = new UserSchema(options);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await UserSchema.updateOne({ _id: id }, { token });
};

module.exports = {
  findById,
  findByEmail,
  create,
  updateToken,
};
