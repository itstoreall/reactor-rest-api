const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const gravatar = require('gravatar');
const {
  Gender: { MALE, FEMALE, NONE },
} = require('../../helpers/constants');
const bcrypt = require('bcryptjs');

const SALT_FACTOR = 6;

// Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 2,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,

      // Optional validation
      validate(value) {
        const re = /\S+@\S+\.\S+/gi;
        return re.test(String(value).toLowerCase());
      },
    },
    gender: {
      type: String,
      enum: {
        values: [MALE, FEMALE, NONE],
        message: 'But it not allowed',
      },
      default: NONE,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: 250 }, true);
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
console.log('userSchema --> Detected!'); // *

// Password encryption (if it has changed or created)
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Password validation
userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};

// Model (is a Class)
const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;

/**
 * - userSchema.pre('') (сделать перед... - первый парам. - метод)
 * - userSchema.methods.validPassword (свойство methods хранит статические свойства юзерСхемы)
 * можно добавлять любые методы (например на экземпляр нашей модели (user) мы добавляем фунцию validPassword)
 *
 * - Gravatar
 * - gravatar.url(this.email, {s: 250}, true) - s - размер (px), (false - http, true - https)
 */
