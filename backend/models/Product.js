const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: String,
    rating: {
      type: Number,
      required: true,
    },
    comment: String,
    image: String, // Optional review image URL
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    countInStock: { type: Number },
    category: { type: String },
    collections: [String],
    material: { type: String },
    gender: { type: String },

    // ✅ Updated: color-wise image mapping
    images: {
      type: Map,
      of: [String],
      default: {},
    },

    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    tags: [String],

    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },

    weight: { type: String },

    skuVariants: [
      {
        sku: {
          type: String,
          default: "",
          index: false
        },
        size: { type: String, required: true },
        color: { type: String, required: true },
      },
    ],

    printTypeId: { type: Number },
    searchFromMyProducts: { type: Number, enum: [0, 1], default: 1 },

    designs: [
      {
        designCode: { type: String },
        widthInches: { type: String },
        heightInches: { type: String },
        placementSku: { type: String },
        designUrl: { type: String },
        mockupUrl: { type: String },
      },
    ],

    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [String],

    reviews: [reviewSchema], // Optional: if you want to store reviews directly
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
