const mongoose = require("mongoose");

const designSchema = new mongoose.Schema(
  {
    designCode: { type: String, required: true },
    widthInches: { type: String, required: true },
    heightInches: { type: String, required: true },
    placementSku: { type: String, required: true }, // e.g., fr, bk
    designUrl: { type: String, required: true },
    mockupUrl: { type: String, required: true },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: String,
    price: {
      type: Number,
      required: true,
    },
    size: String,
    color: String,
    quantity: {
      type: Number,
      required: true,
    },

    // ✅ Qikink integration fields
    sku: {
      type: String,
      required: true,
    },
    search_from_my_products: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    print_type_id: {
      type: Number,
      default: 1, // or required if you're using custom printing
    },
    designs: [designSchema],
  },
  { _id: false }
);


const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [orderItemSchema], 
  shippingAddress: {
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  province: { type: String }, 
  country: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
},
  paymentMethod: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isdelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  paymentStatus:  {
    type: String,
    default: "pending",
  },
  status:{
    type: String,
    enum: ["Processing","Shipped","Delivered","Cancelled"],
    default: "Processing",
  },

},
{timestamps: true}
);

module.exports = mongoose.model("Order", orderSchema);