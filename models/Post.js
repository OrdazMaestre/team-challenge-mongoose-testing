const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: 200
  },
  body: {
    type: String,
    required: [true, 'El contenido es obligatorio'],
    trim: true,
    maxlength: 5000
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);