const Joi = require('joi');
const { HttpCode } = require('../../../helpers/constants');

const schemaCreate = Joi.object({
  name: Joi.string().min(2).required(),
  alt: Joi.string().required(),
  title: Joi.string().min(2).max(25).required(),
  description: Joi.string()
    // .regex(/[^А-ЯЁа-яё]*/)
    .regex(/^[A-Za-z0-9\s,.'!():=-]+$/)
    .min(2)
    .max(100)
    .required(),
  requires: [Joi.string().min(5).max(30), ''],
  restApi: Joi.boolean().required(),
  used: Joi.array().required(),
  page: [Joi.string(), ''],
  source: Joi.string().required(),
  src: Joi.array().required(),
});

const schemaUpdate = Joi.object({
  name: Joi.string().alphanum().min(2).max(25),
  alt: Joi.string(),
  title: Joi.string().min(2).max(25),
  description: Joi.string()
    .regex(/^[A-Za-z0-9\s,.'!():=-]+$/)
    .min(2)
    .max(100),
  restApi: Joi.boolean().required(),
  requires: [Joi.string().alphanum().min(5).max(30), ''],
  used: Joi.array(),
  page: [Joi.string(), ''],
  source: Joi.string(),
  src: Joi.array(),
});

const schemaUsed = Joi.object({
  used: Joi.array().required(),
});

const schemaApi = Joi.object({
  restApi: Joi.boolean().required(),
});

// Function Validation
const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Validation Error --> Field: ${err.message.replace(/"/g, '')}`,
    }); // next падает в app
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

module.exports.validateApi = (req, _res, next) => {
  return validate(schemaApi, req.body, next);
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
