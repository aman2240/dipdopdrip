import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/products/FilterSidebar";
import SortOptions from "../components/products/SortOptions";
import ProductGrid from "../components/products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const SidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const queryParams = Object.fromEntries([...searchParams]);
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    if (SidebarRef.current && !SidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Mobile Filter Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex items-center justify-center mb-2"
      >
        <FaFilter className="mr-2" />
        Filter
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
  ref={SidebarRef}
  className={`${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  } fixed inset-y-0 z-50 left-0 w-64 bg-white shadow-md overflow-y-auto transition-transform duration-300
     lg:static lg:translate-x-0 lg:w-72 lg:min-w-[18rem]`}
>
  <FilterSidebar />
</div>


      {/* Main Content */}
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4 ml-4">{collection || "All Collection"}</h2>
        <SortOptions />
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
