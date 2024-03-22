const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  itemName: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    default: 'n/a',
  },
  modelNo: {
    type: String, //101
    required: true,
  },
  coverImage: {
    type: String,
  },
  image: {
    type: String,
    default: 'https://placehold.co/600x400.svg',
  },
  images: {
    type: Array,
  },
  specifications: {
    type: String,
    ref: 'Specification',
  },
});

const Product = model('Product', productSchema);
module.exports = Product;
