const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let RecipeModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  ingredients: {
    type: Array,
    required: true,
  },
  directions: {
    type: Array,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

RecipeSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  ingredients: doc.ingredients,
  directions: doc.directions,
});


RecipeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return RecipeModel.find(search).select('name ingredients directions').lean().exec(callback);
};

RecipeSchema.statics.findAll = (callback) => {
  const search = {};

  return RecipeModel.find(search).select('name ingredients directions').lean().exec(callback);
};

RecipeModel = mongoose.model('Recipe', RecipeSchema);

module.exports = {
  RecipeModel,
  RecipeSchema,
};
