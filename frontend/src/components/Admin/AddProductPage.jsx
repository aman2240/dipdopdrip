import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: '',
    collections: '',
    material: '',
    gender: '',
    price: '',
    discountPrice: '',
    countInStock: '',
    images: [{ color: '', urls: [] }],
    skuVariants: [],
    isFeatured: false,
    isPublished: false,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    printTypeId: '',
    searchFromMyProducts: 0,
    tags: [],
    designs: [],
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setProductData((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      setUploading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updated = [...productData.images];
      updated[index].urls.push(data.imageUrl);
      setProductData({ ...productData, images: updated });
    } catch (err) {
      console.error('Image Upload Error:', err);
    } finally {
      setUploading(false);
    }
  };

  const addColorGroup = () => {
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, { color: '', urls: [] }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageObj = {};
    productData.images.forEach((img) => {
      if (img.color && img.urls.length) {
        imageObj[img.color] = img.urls;
      }
    });

    const payload = {
      ...productData,
      price: Number(productData.price),
      discountPrice: Number(productData.discountPrice),
      countInStock: Number(productData.countInStock),
      images: imageObj,
      printTypeId:
        productData.searchFromMyProducts === 1 || productData.searchFromMyProducts === '1'
          ? undefined
          : Number(productData.printTypeId) || null,
    };

    if (payload.printTypeId === undefined) delete payload.printTypeId;

    // Submit to backend
    try {
      const config = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem("userToken")}`
  }
};
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, payload,config);
      navigate('/admin/products');
    } catch (err) {
      console.error('Submit Error:', err);
    }
  };

  const handleSkuVariantChange = (index, field, value) => {
    const updated = [...productData.skuVariants];
    updated[index][field] = value;
    setProductData({ ...productData, skuVariants: updated });
  };

  const addSkuVariant = () => {
    setProductData({
      ...productData,
      skuVariants: [...productData.skuVariants, { sku: '', size: '', color: '' }]
    });
  };

  const removeSkuVariant = (index) => {
    const updated = productData.skuVariants.filter((_, i) => i !== index);
    setProductData({ ...productData, skuVariants: updated });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['name', 'category', 'collections', 'material', 'metaTitle', 'metaDescription', 'metaKeywords'].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field}
              value={productData[field]}
              onChange={handleChange}
              className="border p-2 rounded"
              required={['name', 'category', 'collections'].includes(field)}
            />
          ))}

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={productData.price}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="discountPrice"
            placeholder="Discount Price"
            value={productData.discountPrice}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="countInStock"
            placeholder="Stock Count"
            value={productData.countInStock}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select name="gender" value={productData.gender} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Gender</option>
            {['Men', 'Women', 'Unisex'].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            name="searchFromMyProducts"
            value={productData.searchFromMyProducts}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value={0}>Not from My Products</option>
            <option value={1}>From My Products</option>
          </select>

          <input
            type="number"
            name="printTypeId"
            placeholder="Print Type ID"
            value={productData.printTypeId || ''}
            onChange={handleChange}
            disabled={productData.searchFromMyProducts === 1 || productData.searchFromMyProducts === '1'}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex gap-6 my-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" checked={productData.isFeatured} onChange={handleChange} className="h-4 w-4" />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isPublished" checked={productData.isPublished} onChange={handleChange} className="h-4 w-4" />
            Published
          </label>
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

        {/* SKU VARIANTS */}
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

        {/* IMAGE GROUP */}
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
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => {
                    const updated = productData.images.filter((_, i) => i !== idx);
                    setProductData({ ...productData, images: updated });
                  }}
                >Remove</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {imgGroup.urls.map((url, i) => (
                  <img key={i} src={url} alt={`Preview ${i}`} className="w-16 h-16 object-cover rounded border" />
                ))}
              </div>
            </div>
          ))}
          <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addColorGroup}>
            + Add Color Image Group
          </button>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
