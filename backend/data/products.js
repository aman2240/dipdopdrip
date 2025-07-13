const products = [
  {
    name: "Classic Oxford Button-Down Shirt",
    description:
      "This classic Oxford shirt is tailored for a polished yet casual look. Crafted from high-quality cotton, it features a button-down collar and a comfortable, slightly relaxed fit. Perfect for both formal and casual occasions, it comes with long sleeves, a button placket, and a yoke at the back. The shirt is finished with a gently rounded hem and adjustable button cuffs.",
    price: 39.99,
    discountPrice: 34.99,
    countInStock: 20,
    sku: "OX-SH-001",
    category: "Top Wear",
    brand: "Urban Threads",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Red", "Blue", "Yellow"],
    collections: "Business Casual",
    material: "Cotton",
    gender: "Men",
    images: [
      "https://picsum.photos/500/500?random=39",
      "https://picsum.photos/500/500?random=40"
    ],
    rating: 4.5,
    numReviews: 12
  },
  {
    name: "Slim-Fit Stretch Shirt",
    description:
      "A versatile slim-fit shirt perfect for business or evening events. Designed with a fitted silhouette, the added stretch provides maximum comfort throughout the day. Features a crisp turn-down collar, button placket, and adjustable cuffs.",
    price: 29.99,
    discountPrice: 24.99,
    countInStock: 35,
    sku: "SLIM-SH-002",
    category: "Top Wear",
    brand: "Modern Fit",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy Blue", "Burgundy"],
    collections: "Formal Wear",
    material: "Cotton Blend",
    gender: "Men",
    images: [
      "https://picsum.photos/500/500?random=41",
      "https://picsum.photos/500/500?random=42"
    ],
    rating: 4.8,
    numReviews: 15
  },
  {
    name: "Casual Denim Shirt",
    description:
      "This casual denim shirt is made from lightweight cotton denim. It features a regular fit, snap buttons, and a straight hem. With Western-inspired details, this shirt is perfect for layering or wearing solo.",
    price: 49.99,
    discountPrice: 44.99,
    countInStock: 15,
    sku: "CAS-DEN-003",
    category: "Top Wear",
    brand: "Street Style",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Light Blue", "Dark Wash"],
    collections: "Casual Wear",
    material: "Denim",
    gender: "Men",
    images: [
      "https://picsum.photos/500/500?random=43",
      "https://picsum.photos/500/500?random=44"
    ],
    rating: 4.6,
    numReviews: 8
  },
  {
    name: "Printed Resort Shirt",
    description:
      "Designed for summer, this printed resort shirt is perfect for vacation or weekend getaways. It features a relaxed fit, short sleeves, and a camp collar. The all-over tropical print adds a playful vibe.",
    price: 29.99,
    discountPrice: 22.99,
    countInStock: 25,
    sku: "PRNT-RES-004",
    category: "Top Wear",
    brand: "Beach Breeze",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Tropical Print", "Navy Palms"],
    collections: "Vacation Wear",
    material: "Viscose",
    gender: "Men",
    images: [
      "https://picsum.photos/500/500?random=45",
      "https://picsum.photos/500/500?random=1"
    ],
    rating: 4.4,
    numReviews: 10
  },
  {
    name: "Slim-Fit Easy-Iron Shirt",
    description:
      "A slim-fit, easy-iron shirt in woven cotton fabric with a fitted silhouette. Features a turn-down collar, classic button placket, and a yoke at the back. Long sleeves and adjustable button cuffs with a rounded hem.",
    price: 34.99,
    discountPrice: 29.99,
    countInStock: 30,
    sku: "SLIM-EIR-005",
    category: "Top Wear",
    brand: "Urban Chic",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Gray"],
    collections: "Business Wear",
    material: "Cotton",
    gender: "Men",
    images: [
      "https://picsum.photos/500/500?random=47",
      "https://picsum.photos/500/500?random=2"
    ],
    rating: 5,
    numReviews: 14
  },
  {
    name: "Polo T-Shirt with Ribbed Collar",
    description:
      "A wardrobe classic, this polo t-shirt features a ribbed collar and cuffs. Made from 100% cotton, it offers breathability and comfort throughout the day. Tailored in a slim fit with a button placket at the neckline.",
    price: 24.99,
    discountPrice: 19.99,
    countInStock: 50,
    sku: "POLO-TSH-006",
    category: "Top Wear",
    brand: "Polo Classics",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Navy", "Red"],
    collections: "Casual Wear",
    material: "Cotton",
    gender: "Men",
    images: [
      "https://picsum.photos/500/500?random=3",
      "https://picsum.photos/500/500?random=4"
    ],
    rating: 4.3,
    numReviews: 22
  },
  {
    name: "Oversized Graphic T-Shirt",
    description:
      "An oversized graphic t-shirt that combines comfort with street style. Featuring bold prints across the chest, this relaxed fit tee offers a modern vibe, perfect for pairing with jeans or joggers.",
    price: 19.99,
    discountPrice: 15.99,
    countInStock: 40,
    sku: "OVS-GRF-007",
    category: "Top Wear",
    brand: "Street Vibes",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray"],
    collections: "Streetwear",
    material: "Cotton",
    gender: "Men",
    images: [
      "https://picsum.photos/500/500?random=5"
    ],
    rating: 4.6,
    numReviews: 30
  },
  {
    name: "Regular-Fit Henley Shirt",
    description:
      "A modern take on the classic Henley shirt, this regular-fit style features a buttoned placket and ribbed cuffs. Made from a soft cotton blend with a touch of elastane for stretch.",
    price: 22.99,
    discountPrice: 18.99,
    countInStock: 35,
    sku: "REG-HEN-008",
    category: "Top Wear",
    brand: "Heritage Wear",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Heather Gray", "Olive", "Black"],
    collections: "Casual Wear",
    material: "Cotton Blend",
    gender: "Men",
    images: [
      "https://picsum.photos/500/500?random=6"
    ],
    rating: 4.5,
    numReviews: 25
  },
  {
    name: "Long-Sleeve Thermal Tee",
    description:
      "Stay warm with this long-sleeve thermal tee, made from soft cotton with a waffle-knit texture. Ideal for layering in cooler months, the slim-fit design ensures a snug yet comfortable fit.",
    price: 27.99,
    discountPrice: 22.99,
    countInStock: 20,
    sku: "LST-THR-009",
    category: "Top Wear",
    brand: "Winter Basics",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Charcoal", "Dark Green", "Navy"],
    collections: "Winter Essentials",
    material: "Cotton",
    gender: "Men",
    images: [
      "https://picsum.photos/500/500?random=7"
    ],
    rating: 4.4,
    numReviews: 18
  },
  {
    name: "V-Neck Classic T-Shirt",
    description:
      "A classic V-neck t-shirt for everyday wear. This regular-fit tee is made from breathable cotton and features a clean, simple design with a flattering V-neckline. Lightweight fabric and soft texture make it perfect for casual looks.",
    price: 14.99,
    discountPrice: 11.99,
    countInStock: 60,
    sku: "VNECK-CLS-010",
    category: "Top Wear",
    brand: "Everyday Comfort",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Navy"],
    collections: "Basics",
    material: "Cotton",
    gender: "Men",
    images: [
      "https://picsum.photos/500/500?random=8"
    ],
    rating: 4.7,
    numReviews: 28
  }
];

module.exports = products;
