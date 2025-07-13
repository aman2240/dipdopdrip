const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmails");

const router = express.Router();
dotenv.config();


// @route POST /api/checkout
// @desc Create new checkout
router.post("/", protect, async (req, res) => {
  let { checkoutItems, shippingAddress, paymentMethod } = req.body;
  console.log("checkoutItems: ", req.body);

  if (!checkoutItems || checkoutItems.length === 0)
    return res.status(400).json({ message: "No items in checkout" });

  // Patch country code fallback
  const countryMap = {
    India: "IN",
    "United States": "US",
    "United Kingdom": "GB",
    Canada: "CA",
    Australia: "AU",
  };
  if (!shippingAddress.countryCode && shippingAddress.country) {
    shippingAddress.countryCode = countryMap[shippingAddress.country] || "IN";
  }
  if (!shippingAddress.province) {
    shippingAddress.province = "TN";
  }

  try {
    // Resolve correct size, color, sku, and image from backend
    for (const item of checkoutItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      const matchedVariant = product.skuVariants?.find(
        (v) => v.sku === item.sku
      );

      if (!matchedVariant) {
        return res.status(400).json({ message: `Variant SKU not found for ${product.name}` });
      }

      item.size = matchedVariant.size;
      item.color = matchedVariant.color;
      item.sku = matchedVariant.sku;

      // ✅ Resolve image based on selected color
      const imagesObj =
        product.images instanceof Map
          ? Object.fromEntries(product.images)
          : product.images || {};

      const matchedColorKey = Object.keys(imagesObj).find(
        (key) => key.toLowerCase() === item.color.toLowerCase()
      );

      const selectedImages = matchedColorKey ? imagesObj[matchedColorKey] : [];

      // ✅ Save first image of selected color
      item.image = selectedImages[0] || product.image || "";

      // ✅ Save entire images object for future use (finalize, order confirmation)
      item.images = imagesObj;
    }

    // Map extra fields and default design values
    checkoutItems = checkoutItems.map((item) => {
      item.searchFromMyProducts = item.hasOwnProperty("searchFromMyProducts")
        ? item.searchFromMyProducts
        : 1;

      if (item.searchFromMyProducts === 0) {
        item.designs = (item.designs || []).map((d, index) => ({
          designUrl: d.designUrl || "https://example.com/default-design.png",
          mockupUrl: d.mockupUrl || "https://example.com/default-mockup.png",
          placementSku: d.placementSku || "FT-HS-A3",
          heightInches: Math.min(d.heightInches || 18, 18),
          widthInches: Math.min(d.widthInches || 14, 14),
          designCode: d.designCode || `AUTO-${item.sku || "SKU"}-${index}`,
        }));
      }

      return item;
    });

    const totalPrice = checkoutItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const fullName = req.user.name?.trim() || "Customer";
const [firstName, ...rest] = fullName.split(" ");
const lastName = rest.join(" ") || "Last";

const newCheckout = await Checkout.create({
  user: req.user._id,
  checkoutItems,
  shippingAddress: {
    first_name: firstName,
    last_name: lastName,
    address: shippingAddress.address,
    city: shippingAddress.city,
    postalCode: shippingAddress.postalCode,
    province: shippingAddress.province || "TN",
    country: shippingAddress.country,
    countryCode: shippingAddress.countryCode || "IN",
    phone: shippingAddress.phone || req.user.phone || "",
    email: shippingAddress.email || req.user.email || "",
  },
  paymentMethod,
  totalPrice,
  paymentStatus: "Pending",
  isPaid: false,
});


    res.status(201).json(newCheckout);
  } catch (err) {
    console.error("Checkout Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// @route PUT /api/checkout/:id/pay
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid payment status" });
    }
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/checkout/:id/finalize
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id).populate("user");
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    if (!checkout.isPaid) return res.status(400).json({ message: "Checkout not paid" });
    if (checkout.isFinalized) return res.status(400).json({ message: "Already finalized" });

    // ✅ Create Order from checkout
    const finalOrder = await Order.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems.map((item) => {
        const imagesObj =
          item.images instanceof Map
            ? Object.fromEntries(item.images)
            : item.images || {};

        const matchedColorKey = Object.keys(imagesObj).find(
          (key) => key.toLowerCase() === item.color?.toLowerCase()
        );

        const selectedImages = matchedColorKey ? imagesObj[matchedColorKey] : [];
        const resolvedImage = selectedImages?.[0] || item.image || "";

        return {
          productId: item.productId,
          name: item.name,
          image: resolvedImage,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          sku: item.sku,
          search_from_my_products:
            item.hasOwnProperty("searchFromMyProducts") ? item.searchFromMyProducts : 1,
          print_type_id: item.printTypeId,
          designs: item.designs,
        };
      }),

      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: true,
      paidAt: checkout.paidAt,
      isdelivered: false,
      paymentStatus: "paid",
      paymentDetails: checkout.paymentDetails,
    });

    // ✅ Finalize checkout and clear cart
checkout.isFinalized = true;
checkout.finalizedAt = Date.now();
await checkout.save();

// 🗑️ Clear cart
await Cart.findOneAndDelete({ user: checkout.user._id });


// 📨 USER EMAIL
if (checkout.user?.email) {
  const userEmailSubject = `Order Placed - #${finalOrder._id}`;
const userEmailHtml = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://res.cloudinary.com/dwieck4db/image/upload/v1752318710/xotopbzqfytuyzvv0qqm.jpg" alt="dipdopdrip" width="120" />
    </div>
    <p>Dear ${checkout.user.name?.split(" ")[0] || "Customer"},</p>
    <p>Your order has been placed with <strong>dipdopdrip</strong>.</p>
    
    <p><strong>Order Number:</strong> ${finalOrder._id}</p>
    <p><strong>Order Type:</strong> ${checkout.paymentMethod}</p>

    <p style="margin-top: 20px;">Please reply to this email for any further assistance.</p>
    <p>Thank you for choosing <strong>dipdopdrip</strong>.</p>
    <br />
    <p>- Team dipdopdrip</p>
  </div>
`;
await sendEmail({
  to: checkout.user.email,
  subject: userEmailSubject,
  html: userEmailHtml,
});

} else {
  console.warn("User email not available. Skipping user email.");
}

// 📨 ADMIN EMAIL
// Split the ADMIN_EMAILS env by comma or treat as a single email
const rawAdminEmails = process.env.ADMIN_EMAILS || '';
const adminEmails = rawAdminEmails
  .split(',')
  .map(email => email.trim())
  .filter(email => email); // removes empty strings


const adminHtml = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #333;">New Order Received - <strong>#${finalOrder._id}</strong></h2>
    <p><strong>User:</strong> ${checkout.user.name || "Unknown"} (${checkout.user.email || "No email"})</p>
    <p><strong>Paid At:</strong> ${new Date(finalOrder.paidAt).toLocaleString()}</p>
    <p><strong>Payment Method:</strong> ${finalOrder.paymentMethod}</p>
    <p><strong>Total Price:</strong> ₹${finalOrder.totalPrice}</p>

    <h3>Shipping Address:</h3>
    <ul>
      <li><strong>Name:</strong> ${finalOrder.shippingAddress.first_name} ${finalOrder.shippingAddress.last_name}</li>
      <li><strong>Address:</strong> ${finalOrder.shippingAddress.address}, ${finalOrder.shippingAddress.city}, ${finalOrder.shippingAddress.postalCode}</li>
      <li><strong>Province:</strong> ${finalOrder.shippingAddress.province}</li>
      <li><strong>Country:</strong> ${finalOrder.shippingAddress.country} (${finalOrder.shippingAddress.countryCode})</li>
      <li><strong>Phone:</strong> ${finalOrder.shippingAddress.phone}</li>
    </ul>

    <h3>Order Items:</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ccc; padding: 8px;">Product</th>
          <th style="border: 1px solid #ccc; padding: 8px;">SKU</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Size</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Color</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Qty</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${finalOrder.orderItems
          .map(
            (item) => `
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">${item.name}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${item.sku}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${item.size}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${item.color}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${item.quantity}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">₹${item.price}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <p style="margin-top: 20px;">This order has been finalized and paid.</p>
  </div>
`;

if (adminEmails.length > 0) {
  await Promise.allSettled(
    adminEmails.map((adminEmail) =>
      sendEmail({
        to: adminEmail.trim(),
        subject: `New Order Received - #${finalOrder._id}`,
        html: adminHtml,
      })
    )
  );
} else {
  console.warn("No admin emails configured in ADMIN_EMAILS");
}


res.status(201).json(finalOrder);
} catch (error) {
  console.error("Finalize Error:", error);
  res.status(500).json({ message: "Server Error" });
}
}); // <-- 🔧 This was missing (closes POST /:id/finalize)

// ✅ Correctly defined new route outside the finalize handler
// @route DELETE /api/checkout/clear
// @desc Delete all checkout data (use only in dev)
// @access Private/Admin
router.delete("/clear", protect, admin, async (req, res) => {
  try {
    await Checkout.deleteMany({});
    res.status(200).json({ message: "All checkout data deleted." });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;