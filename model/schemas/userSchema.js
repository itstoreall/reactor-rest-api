const mongoose = require('mongoose');
const { Schema } = require('mongoose');

// Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 2,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'none'],
        message: 'But it not allowed',
      },
      default: 'none',
    },
    owner: {
      name: String,
      email: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// Virtual field
userSchema.virtual('isView').get(function () {
  return `Project ${this.title} requires a Server`;
});

// Checking
userSchema.path('description').validate(value => {
  // const regul = /^[a-zA-Z0-9\s.,]+/g;
  const regul = /^[A-Z][A-Za-z0-9\s,.=-]+$/;
  return regul.test(String(value));
});

// Model (is a Class)
const ProjectModel = mongoose.model('project', userSchema);

module.exports = ProjectModel;
