const ProjectSchema = require('./schemas/projectSchema');

// Get all
const getAll = async query => {
  const results = await ProjectSchema.find({});
  return results;
};

// Get filtered
const getFiltered = async (userId, query) => {
  console.log('getFiltered userId: --> ', userId);
  console.log('getFiltered query: --> ', query);

  // Mongoose pagination
  const {
    limit = 5,
    offset = 0,
    sortBy,
    sortByDesk,
    filter,
    restApi = null,
  } = query;
  console.log('restApi-->', Boolean(restApi));
  const optionSearch = { owner: userId };

  if (restApi !== null) {
    optionSearch.restApi = restApi;
  }

  const results = await ProjectSchema.paginate(optionSearch, { limit, offset });

  // Converts the answer from paginate
  const { docs: projects, totalDocs: total } = results;

  // const results = await ProjectSchema.findOne({ owner: userId }).populate({
  //   path: 'owner',
  //   select: 'name email gender -_id',
  // });

  return { projects, total, limit, offset };
};

// Get by ID
const getById = async (userId, id) => {
  const result = await ProjectSchema.findOne({
    _id: id,
    owner: userId,
  }).populate({ path: 'owner', select: 'name email gender -_id' });
  // console.log('Creation time:', result._id.getTimestamp()); // *
  return result;
};

// Create
const create = async body => {
  console.log('body to create: -->', body);
  const result = await ProjectSchema.create(body);
  return result;
};

// Remove
const remove = async (userId, id) => {
  const result = await ProjectSchema.findByIdAndRemove({
    _id: id,
    owner: userId,
  });
  return result;
};

// Update
const update = async (userId, id, body) => {
  const result = await ProjectSchema.findOneAndUpdate(
    { _id: id, owner: userId },
    { ...body },
    { new: true },
  );

  return result;
};

module.exports = {
  getAll,
  getFiltered,
  getById,
  remove,
  create,
  update,
};

/**
 * Сущность проекта (Mongoose)
 * - new: true (возвращать новые данные (по умолчанию возвр. предидущие))
 * - mongoose pagination:
 * limit - сколько выдать на странице;
 * offset - сколько нужно пропустить (offset и skip - одно и то же)
 * sortBy - сорт полей по возрастанию;
 * sortByDesk - сорт полей по убыванию;
 * filter - возвращать не все поля, а некоторые
 *
 * .paginate(optionsSearch, {limit, ...}) - вторым парам. в пагинэйт передаются настройки
 */
