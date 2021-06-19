const ProjectModel = require('./schemas/projectSchema');

// Get all
const getAll = async () => {
  const results = await ProjectModel.find({});
  return results;
};

// Get by ID
const getById = async id => {
  const result = await ProjectModel.findOne({ _id: id });
  console.log('Creation time:', result._id.getTimestamp());
  return result;
};

// Create
const create = async body => {
  const result = await ProjectModel.create(body);
  return result;
};

// Remove
const remove = async id => {
  const result = await ProjectModel.findByIdAndRemove({ _id: id });
  return result;
};

// Update
const update = async (id, body) => {
  const result = await ProjectModel.findOneAndUpdate(
    { _id: id },
    { ...body },
    { new: true },
  );

  return result;
};

module.exports = {
  getAll,
  getById,
  remove,
  create,
  update,
};

/**
 * Сущность проекта (Mongoose)
 * - new: true (возвращать новые данные (по умолчанию возвр. предидущие))
 */
