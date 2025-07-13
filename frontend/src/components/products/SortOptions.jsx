import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue) {
      searchParams.set('sort', selectedValue);  // ✅ correct key
    } else {
      searchParams.delete('sort');
    }

    // ✅ remove old "sortBy" if it's still lingering
    searchParams.delete('sortBy');

    setSearchParams(searchParams);
  };

  return (
    <div className="mb-3 flex items-center justify-end">
      <select
        id="sort"
        onChange={handleSortChange}
        value={searchParams.get('sort') || ''}
        className="border p-2 rounded-md focus:outline-none"
      >
        <option value="">Default</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortOptions;
