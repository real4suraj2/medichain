const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  publicKey: {type: String, required: true },
  privateKey: { type: String, required: true },
  kind : {type: String, required: true}
  });

module.exports = mongoose.model('User', userSchema);
