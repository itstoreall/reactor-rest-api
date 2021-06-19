const mongoose = require('mongoose');
const { Schema } = require('mongoose');

// Schema
const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      max: 25,
    },
    description: {
      type: String,
      required: true,
      max: 100,
    },
    requires: {
      type: String,
      required: false,
      max: 30,
    },
    used: {
      type: Array,
      required: true,
      set: data => data || [],
    },
    page: {
      type: String,
      required: false,
    },
    source: {
      type: String,
      required: true,
    },
    src: {
      type: Array,
      required: true,
      set: data => data || [],
    },
    owner: {
      name: String,
      email: String,
    },
  },
  { versionKey: false, timestamps: true },
);

// Checking
projectSchema.path('description').validate(value => {
  // const regul = /^[a-zA-Z0-9\s.,]+/g;
  const regul = /^[A-Z][A-Za-z0-9\s,.=-]+$/;
  return regul.test(String(value));
});

// Model (is a Class)
const ProjectModel = mongoose.model('project', projectSchema);

module.exports = ProjectModel;

/**
 * Examples:

isDo: {
  type: Boolean,
  default: false,
},

 */
