const ProjectSchema = require('./schemas/projectSchema');

// Get all
const getAll = async query => {
  const results = await ProjectSchema.find({});
  return results;
};

// Get filtered
const getFiltered = async (userId, query) => {
  // Mongoose pagination
  const {
    page = 0,
    limit = 5,
    // offset = 0,
    sortBy,
    sortByDesk,
    filter, // &filter=name|title|restApi
    restApi = null,
  } = query;

  const optionSearch = { owner: userId };

  if (restApi !== null) {
    optionSearch.restApi = restApi;
  }

  const results = await ProjectSchema.paginate(optionSearch, {
    page,
    limit,
    // offset,
    select: filter ? filter.split('|').join(' ') : '', // --> name title restApi
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesk ? { [`${sortByDesk}`]: -1 } : {}),
    },
  });

  // Converts the answer from paginate
  const { docs: projects, totalDocs: total } = results;

  return { projects, total, page, limit };
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
 * - .paginate(optionsSearch, {limit, ...}) - вторым парам. в пагинэйт передаются настройки
 * - filter = select (поля которые дать в выдачу json)
 * - sort: { ...(sortBy ? {[`${sortBy}`] : 1} : {}) } (если пришло какае-то поле - [}: - указываем имя
 * этого поля и 1 единичка - сортировать по нему. Оборачиваем в объект (для тернарника) и если не пришло
 * то - : {} - возвращаем пустой объект. То же и для sortByDesk только -1 - в другую сторону сорт.)
 *
 *
 * - query-string:
 * - http://localhost:3000/api/projects/filtered?limit=2&offset=0&filter=name|title|restApi&sortBy=name
 * or
 * - http://localhost:3000/api/projects/filter?page=0&limit=2&filter=name|title|restApi&sortBy=name
 */
