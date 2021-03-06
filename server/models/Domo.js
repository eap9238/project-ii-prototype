const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
const setTitle = (title) => _.escape(title).trim();

const DomoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },
  body: {
    type: String,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  date: {
    type: String,
    default: new Date().getMonth() + "/" + new Date().getDate() + "/" + new Date().getFullYear(),
  },
  colour: {
    type: String,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  body: doc.body,
  _id: doc._id,
  colour: doc.colour,
  date: doc.date,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return DomoModel.find(search).select('title body colour date').exec(callback);
};

DomoSchema.statics.removeByID = (docID, callback) => {
  const search = {
    _id: docID,
  };

  return DomoModel.find(search).remove().exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;