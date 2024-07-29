const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const { ObjectId } = Schema.Types;

const productSchema = new Schema(
  {
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
      type: ObjectId,
      ref: 'Specifications',
    },
  },
  { versionKey: false, timestamps: true }
);

// This method checks if the product id is valid or not
productSchema.methods.checkProductId = function (id) {
  return mongoose.Types.ObjectId.isValid(id);
};

const Product = model('Product', productSchema);
module.exports = Product;
