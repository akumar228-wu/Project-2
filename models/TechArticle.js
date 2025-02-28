const mongoose = require('mongoose');

const techArticleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image_url: { type: String, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now },
  content: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ["AI", "Cybersecurity", "Gadgets", "Software", "Gaming"] },
  likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('TechArticle', techArticleSchema);
