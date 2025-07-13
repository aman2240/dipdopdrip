const mongoose = require("mongoose");

// ✅ Design Schema should be defined first
const designSchema = new mongoose.Schema({
  designCode: { type: String, required: true },
  widthInches: { type: String, required: true },
  heightInches: { type: String, required: true },
  placementSku: { type: String, required: true }, // e.g., "fr", "bk"
  designUrl: { type: String, required: true },
  mockupUrl: { type: String, required: true },
}, { _id: false });

// ✅ Define CheckoutItem Schema next
const checkoutItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  images: {
      type: Map,
      of: [String],
      default: {},
    },
  variantImage: { type: String }, // image for selected color (optional)
  price: { type: Number, required: true },
  discountPrice: { type: Number }, // optional
  quantity: { type: Number, required: true },
  sku: { type: String, required: true },
  size: { type: String }, // from skuVariants
  color: { type: String }, // from skuVariants
  searchFromMyProducts: {
    type: Number,
    default: 1,
  },
  printTypeId: { type: Number },
  designs: [designSchema], // must be declared after defining designSchema
}, { _id: false });

// ✅ Now define Checkout Schema
const checkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkoutItems: [checkoutItemSchema],
  shippingAddress: {
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  province: { type: String }, // optional if you're using it
  country: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
},

  paymentMethod: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  paymentStatus: { type: String, default: "pending" },
  paymentDetails: { type: mongoose.Schema.Types.Mixed },
  isFinalized: { type: Boolean, default: false },
  finalizedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Checkout", checkoutSchema);
