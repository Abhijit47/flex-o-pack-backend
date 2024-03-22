const { Schema, model } = require('mongoose');

const specificationSchema = new Schema({
  products: {
    type: String,
    enum: {
      values: [
        'namkeen',
        'pulses',
        'granules',
        'tea',
        'fryums',
        'besan',
        'maida',
        'milk-powder',
        'spices-powder',
        'free-flowing-powder',
        'potato-chips',
        'dry-fruit',
        'pharmaceuticals',
        'kurkure',
        'paan-masala',
        'jeera',
        'mouth-freshener',
        'fruit-balls',
        'gems',
        'spices',
        'fryms',
        'pan-masala',
        'gutkha',
        'shampoo',
        'lubricant',
        'oil',
        'paste',
        'oil-cream-ketch-up',
        'powder',
        'liquid',
      ],
      message: '{VALUE} is not supported',
    },
  },
  noOfTracks: {
    type: String,
    default: 'n/a',
  },
  weighHeadNos: {
    type: Array,
    default: 'n/a',
  },
  feedingStyle: {
    type: String,
    default: 'n/a',
  },
  fillingSystem: {
    type: Array,
    default: 'n/a',
  },
  fillingAccuracy: {
    type: String,
    default: 'n/a',
  },
  sealType: {
    type: Array,
    default: 'n/a',
  },
  fillingRange: {
    type: String,
    default: 'n/a',
  },
  packingMaterial: {
    type: Array,
    default: 'n/a',
  },
  laminateSpecs: {
    type: Array,
    default: 'n/a',
  },
  lengthOfPouch: {
    type: String,
    default: 'n/a',
  },
  pouchDimensions: {
    type: Array,
    default: 'n/a',
  },
  powerConsumption: {
    type: Array,
    default: 'n/a',
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
  Weight: {
    type: String,
    default: 'n/a',
  },
  materialOfChasis: {
    type: String,
    default: 'n/a',
  },
  hopper: {
    type: Array,
    default: 'n/a',
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
    default: 'n/a',
  },
});

const Specification = model('Specification', specificationSchema);
modules.exports = Specification;
