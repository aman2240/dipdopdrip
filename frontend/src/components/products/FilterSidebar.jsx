import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import colorMap from "../../utils/colorMap";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    color: '',
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 2000
  });

  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = ['Oversized'];
  const colors = Object.keys(colorMap);
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const materials = ['Cotton',  'Acid Wash'];
  const genders = ['Men', 'Women'];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    const minPrice = Number(params.minPrice || 0);
    const maxPrice = Number(params.maxPrice || 2000);

    setFilters({
      category: params.category || '',
      gender: params.gender || '',
      color: params.color || '',
      size: params.size ? params.size.split(',') : [],
      material: params.material ? params.material.split(',') : [],
      brand: params.brand ? params.brand.split(',') : [],
      minPrice,
      maxPrice
    });

    setPriceRange([minPrice, maxPrice]);
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newFilters = { ...filters };

    if (type === 'checkbox') {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      const value = newFilters[key];
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','));
      } else if (typeof value === 'string' && value.trim() !== '') {
        params.set(key, value);
      } else if ((key === 'minPrice' || key === 'maxPrice') && value !== null) {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  };

  const handleColorSelect = (color) => {
    const formattedColor = color.trim();
    const newFilters = { ...filters, color: formattedColor };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handlePriceChange = (e) => {
    const max = Number(e.target.value);
    setPriceRange([0, max]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: max };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      category: '',
      gender: '',
      color: '',
      size: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: 2000
    };
    setFilters(defaultFilters);
    setPriceRange([0, 2000]);
    setSearchParams({});
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>

      <button
        onClick={resetFilters}
        className="mt-0 mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm w-full"
      >
        Clear Filters
      </button>

      {/* Category */}
      <div className="mb-6">
        <label className="block text-gray-800 font-medium mb-2">Category</label>
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-1">
            <input
              type="radio"
              name="category"
              value={category}
              onChange={handleFilterChange}
              checked={filters.category === category}
              className="mr-2 h-4 w-4 accent-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{category}</span>
          </div>
        ))}
      </div>

      {/* Gender */}
      <div className="mb-6">
        <label className="block text-gray-800 font-medium mb-2">Gender</label>
        {genders.map((gender) => (
          <div key={gender} className="flex items-center mb-1">
            <input
              type="radio"
              name="gender"
              value={gender}
              onChange={handleFilterChange}
              checked={filters.gender === gender}
              className="mr-2 h-4 w-4 accent-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{gender}</span>
          </div>
        ))}
      </div>

      {/* Color */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 rounded-full border-2 transition hover:scale-105 ${
                filters.color === color ? 'border-black scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: colorMap[color] || '#ccc' }}
            ></button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Size</label>
        {sizes.map((size) => (
          <div key={size} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="size"
              value={size}
              onChange={handleFilterChange}
              checked={filters.size.includes(size)}
              className="mr-2 h-4 w-4 accent-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{size}</span>
          </div>
        ))}
      </div>

      {/* Material */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Material</label>
        {materials.map((material) => (
          <div key={material} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="material"
              value={material}
              onChange={handleFilterChange}
              checked={filters.material.includes(material)}
              className="mr-2 h-4 w-4 accent-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{material}</span>
          </div>
        ))}
      </div>

      {/* Price */}
      <div className="mb-8">
        <label className="block text-gray-600 font-medium mb-2">Price Range</label>
        <input
          type="range"
          name="price"
          min={0}
          max={2000}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-gray-600 mt-2">
          <span>₹0</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
