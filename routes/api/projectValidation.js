const Joi = require('joi');

const schemaCreate = Joi.object({
  name: Joi.string().alphanum().min(2).max(25).required(),
  alt: Joi.string().alphanum().min(2).required(),
  title: Joi.string().alphanum().min(2).max(25).required(),
  description: Joi.string().alphanum().min(2).max(100).required(),
  requires: Joi.string().alphanum().min(2).max(30),
  used: Joi.array().items(Joi.alphanum()).required(),
  page: Joi.string(),
  source: Joi.string().required(),
  src: Joi.array().items(Joi.alphanum()).required(),
});

const schemaUpdate = Joi.object({
  name: Joi.string().alphanum().min(2).max(25),
  alt: Joi.string().alphanum().min(2),
  title: Joi.string().alphanum().min(2).max(25),
  description: Joi.string().alphanum().min(2).max(100),
  requires: Joi.string().alphanum().min(2).max(30),
  used: Joi.array().items(Joi.alphanum()),
  page: Joi.string(),
  source: Joi.string(),
  src: Joi.array().items(Joi.alphanum()),
});

const schemaUsed = Joi.object({
  used: Joi.array().items(Joi.alphanum()).required(),
});

// Function Validation
const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({ status: 400, message: `Field: ${err.message.replace(/"/g, '')}` }); // next падает в app
  }
};

// Middlewars
module.exports.validateCreate = (req, _res, next) => {
  return validate(schemaCreate, req.body, next);
};

module.exports.validateUpdate = (req, _res, next) => {
  return validate(schemaUpdate, req.body, next);
};

module.exports.validateUsed = (req, _res, next) => {
  return validate(schemaUsed, req.body, next);
};

/**
 * Валидация прикручена в роуты
 * 
 * - .alphanum()(только цифры и буквы латинские)
 * - Joi.ref('password') (правила идентичные как в password)
 * - [Joi.string(), Joi.number()] (или строка или число)
 * - Joi.number().integer().min(1900).max(2013), (целое число мин макс)
 * - .with('username', 'birth_year') (одно поле должно быть с другим полем вместе)
 * - .xor('password', 'access_token') (взаимоисключающие поля)
 * 
 * Template
 
 const schemaCreateProject = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),

  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  repeat_password: Joi.ref('password'),
  access_token: [Joi.string(), Joi.number()],
  birth_year: Joi.number().integer().min(1900).max(2013),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
})
  .with('username', 'birth_year')
  .xor('password', 'access_token')
  .with('password', 'repeat_password');

schema.validate({ username: 'abc', birth_year: 1994 });
// -> { value: { username: 'abc', birth_year: 1994 } }

schema.validate({});
// -> { value: {}, error: '"username" is required' }

// Also -

try {
  const value = await schema.validateAsync({
    username: 'abc',
    birth_year: 1994,
  });
} catch (err) {}
 
 */
