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
  {
    versionKey: false,
    timestamps: true,

    // Prints to the console
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id; // Hide the field
        delete ret.alt; // Hide the field
        delete ret.name; // Hide the field
        delete ret.description; // Hide the field
        delete ret.requires; // Hide the field
        delete ret.page; // Hide the field
        delete ret.source; // Hide the field
        delete ret.used; // Hide the field
        delete ret.src; // Hide the field
        delete ret.isView; // Hide the field
        delete ret.createdAt; // Hide the field
        delete ret.updatedAt; // Hide the field
        return ret;
      },
    },

    // Prints to the json
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id; // Hide the field
        delete ret.isView; // Hide the virtual field
        return ret;
      },
    },
  },
);

// Virtual field
projectSchema.virtual('isView').get(function () {
  return `Project ${this.title} requires a Server`;
});

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

 * - transform: function(doc, ret) (убираем поля из выдвчи)
 * (doc - то, что из базы пришло, ret - то, что нужно поменять)
 */
