const { Schema, model } = require('mongoose');
const { productItems } = require('../utils/index');

const { ObjectId } = Schema.Types;

const specificationSchema = new Schema(
  {
    productId: {
      type: ObjectId,
      ref: 'Product',
    },
    products: {
      type: [String],
      enum: {
        values: productItems,
        message: '{VALUE} is not supported',
      },
    },
    noOfTracks: {
      type: String,
      default: 'n/a',
    },
    weighHeadNos: {
      type: Array,
      default: ['n/a'],
    },
    feedingStyle: {
      type: String,
      default: 'n/a',
    },
    fillingSystem: {
      type: Array,
      default: ['n/a'],
    },
    fillingAccuracy: {
      type: String,
      default: 'n/a',
    },
    sealType: {
      type: Array,
      default: ['n/a'],
    },
    fillingRange: {
      type: String,
      default: 'n/a',
    },
    packingMaterial: {
      type: Array,
      default: ['n/a'],
    },
    laminateSpecs: {
      type: Array,
      default: ['n/a'],
    },
    lengthOfPouch: {
      type: String,
      default: 'n/a',
    },
    pouchDimensions: {
      type: Array,
      default: ['n/a'],
    },
    powerConsumption: {
      type: Array,
      default: ['n/a'],
    },
    compressedAirRequired: {
      type: String,
      default: 'n/a',
    },
    touchScreen: {
      type: String,
      default: 'n/a',
    },
    productionOutput: {
      type: String,
      default: 'n/a',
    },
    weight: {
      type: String,
      default: 'n/a',
    },
    materialOfChasis: {
      type: String,
      default: 'n/a',
    },
    hopper: {
      type: Array,
      default: ['n/a'],
    },
    conveyor: {
      type: String,
      default: 'n/a',
    },
    thicknessOfBucket: {
      type: String,
      default: 'n/a',
    },
    machineSize: {
      type: Array,
      default: ['n/a'],
    },
  },
  { versionKey: false, timestamps: true }
);

const Specifications = model('Specifications', specificationSchema);
module.exports = Specifications;
