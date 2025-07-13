import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { fetchProductDetails, updateProduct } from "../../redux/slices/productsSlice";

// ... imports remain unchanged

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector((state) => state.products);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: '',
    discountPrice: '',
    countInStock: '',
    sku: "",
    category: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [{ color: "", urls: [] }],
    isFeatured: false,
    isPublished: false,
    tags: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    printTypeId: null,
    searchFromMyProducts: 0,
    designs: [],
    skuVariants: [],
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
  if (selectedProduct) {
    const normalizedImages = selectedProduct.images && typeof selectedProduct.images === 'object'
      ? Object.entries(selectedProduct.images).map(([color, urls]) => ({ color, urls }))
      : [{ color: '', urls: [] }];

    const clonedSkuVariants = Array.isArray(selectedProduct.skuVariants)
      ? selectedProduct.skuVariants.map(variant => ({ ...variant }))
      : [];

    setProductData({
      ...selectedProduct,
      tags: selectedProduct.tags || [],
      designs: selectedProduct.designs || [],
      skuVariants: clonedSkuVariants,
      images: normalizedImages,
    });
  }
}, [selectedProduct]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e, colorIndex) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedImages = [...productData.images];
      const updatedImageGroup = {
  ...updatedImages[colorIndex],
  urls: [...updatedImages[colorIndex].urls, data.imageUrl],
};

updatedImages[colorIndex] = updatedImageGroup;

setProductData((prevData) => ({
  ...prevData,
  images: updatedImages,
}));


      setProductData((prevData) => ({
        ...prevData,
        images: updatedImages,
      }));
    } catch (error) {
      console.error("Image Upload Failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const imageObj = {};
  productData.images.forEach((img) => {
    if (img.color && img.urls.length) {
      imageObj[img.color] = img.urls;
    }
  });

  const finalData = {
    ...productData,
    price: Number(productData.price),
    discountPrice: Number(productData.discountPrice),
    countInStock: Number(productData.countInStock),
    images: imageObj,
    printTypeId:
      productData.searchFromMyProducts === 1 || productData.searchFromMyProducts === "1"
        ? undefined
        : Number(productData.printTypeId) || null,
  };

  if (finalData.printTypeId === undefined) {
    delete finalData.printTypeId;
  }

  dispatch(updateProduct({ id, productData: finalData }));
  navigate("/admin/products");
};


  const handleSkuVariantChange = (index, field, value) => {
    const updated = [...productData.skuVariants];
    updated[index][field] = value;
    setProductData({ ...productData, skuVariants: updated });
  };

  const addSkuVariant = () => {
    setProductData({
      ...productData,
      skuVariants: [...productData.skuVariants, { sku: "", size: "", color: "" }]
    });
  };

  const removeSkuVariant = (index) => {
    const updated = productData.skuVariants.filter((_, i) => i !== index);
    setProductData({ ...productData, skuVariants: updated });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* ...Your existing fields... */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <input
    type="text"
    name="name"
    value={productData.name}
    onChange={handleChange}
    placeholder="Product Name"
    className="border p-2 rounded"
    required
  />
  <input
    type="number"
    name="price"
    value={productData.price}
    onChange={handleChange}
    placeholder="Price"
    className="border p-2 rounded"
  />
  <input
    type="number"
    name="discountPrice"
    value={productData.discountPrice}
    onChange={handleChange}
    placeholder="Discount Price"
    className="border p-2 rounded"
  />
  <input
    type="number"
    name="countInStock"
    value={productData.countInStock}
    onChange={handleChange}
    placeholder="Stock Count"
    className="border p-2 rounded"
  />
  <input
    type="text"
    name="category"
    value={productData.category}
    onChange={handleChange}
    placeholder="Category"
    className="border p-2 rounded"
  />
  <input
    type="text"
    name="collections"
    value={productData.collections}
    onChange={handleChange}
    placeholder="Collections"
    className="border p-2 rounded"
  />
  <input
    type="text"
    name="material"
    value={productData.material}
    onChange={handleChange}
    placeholder="Material"
    className="border p-2 rounded"
  />
  <input
    type="text"
    name="metaTitle"
    value={productData.metaTitle}
    onChange={handleChange}
    placeholder="Meta Title"
    className="border p-2 rounded"
  />
  <input
    type="text"
    name="metaDescription"
    value={productData.metaDescription}
    onChange={handleChange}
    placeholder="Meta Description"
    className="border p-2 rounded"
  />
  <input
    type="text"
    name="metaKeywords"
    value={productData.metaKeywords}
    onChange={handleChange}
    placeholder="Meta Keywords"
    className="border p-2 rounded"
  />
</div>

<div className="my-6">
  <label className="block font-semibold mb-2">Description</label>
  <textarea
    name="description"
    value={productData.description}
    onChange={handleChange}
    rows={4}
    className="w-full border p-2 rounded"
    required
  />
</div>



<div className="mb-6">
  <label className="block font-semibold mb-2">Gender</label>
  <select
    name="gender"
    value={productData.gender}
    onChange={handleChange}
    className="w-full border p-2 rounded"
  >
    <option value="">Select</option>
    <option value="Men">Men</option>
    <option value="Women">Women</option>
    <option value="Unisex">Unisex</option>
  </select>
</div>

<div className="flex gap-6 mb-6">
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      name="isFeatured"
      checked={productData.isFeatured}
      onChange={(e) =>
        setProductData({ ...productData, isFeatured: e.target.checked })
      }
      className="h-4 w-4"
    />
    Featured
  </label>
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      name="isPublished"
      checked={productData.isPublished}
      onChange={(e) =>
        setProductData({ ...productData, isPublished: e.target.checked })
      }
      className="h-4 w-4"
    />
    Published
  </label>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  <input
    type="number"
    name="printTypeId"
    value={productData.printTypeId || ""}
    onChange={handleChange}
    placeholder="Print Type ID"
    className="border p-2 rounded"
    disabled={
      productData.searchFromMyProducts === 1 ||
      productData.searchFromMyProducts === "1"
    }
  />
  <select
    name="searchFromMyProducts"
    value={productData.searchFromMyProducts}
    onChange={handleChange}
    className="border p-2 rounded"
  >
    <option value={0}>Not from My Products</option>
    <option value={1}>From My Products</option>
  </select>
</div>


        {/* SkuVariants Table */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU Variants</label>
          {productData.skuVariants.map((variant, index) => (
            <div key={index} className="flex gap-4 items-center mb-2">
              <input
                type="text"
                placeholder="SKU"
                value={variant.sku}
                onChange={(e) => handleSkuVariantChange(index, 'sku', e.target.value)}
                className="border p-2 rounded w-1/3"
              />
              <input
                type="text"
                placeholder="Size"
                value={variant.size}
                onChange={(e) => handleSkuVariantChange(index, 'size', e.target.value)}
                className="border p-2 rounded w-1/3"
              />
              <input
                type="text"
                placeholder="Color"
                value={variant.color}
                onChange={(e) => handleSkuVariantChange(index, 'color', e.target.value)}
                className="border p-2 rounded w-1/3"
              />
              <button type="button" className="text-red-500" onClick={() => removeSkuVariant(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addSkuVariant} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">+ Add SKU Variant</button>
        </div>

        {/* Images by Color */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Images by Color</label>
          {productData.images.map((imgGroup, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="text"
                  placeholder="Color"
                  value={imgGroup.color}
                  onChange={(e) => {
                    const updated = [...productData.images];
                    updated[idx].color = e.target.value;
                    setProductData({ ...productData, images: updated });
                  }}
                  className="border p-2 rounded w-1/3"
                />
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => handleImageUpload(e, idx)}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50"
                />
                {uploading && <p>Uploading image...</p>}
                <button type="button" className="text-red-500" onClick={() => {
                  const updated = productData.images.filter((_, i) => i !== idx);
                  setProductData({ ...productData, images: updated });
                }}>Remove</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {imgGroup.urls.map((url, i) => (
                  <img key={i} src={url} alt={`Preview ${i}`} className="w-16 h-16 object-cover rounded border" />
                ))}
              </div>
            </div>
          ))}
          <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setProductData({ ...productData, images: [...productData.images, { color: "", urls: [] }] })}>
            + Add Color Image Group
          </button>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
