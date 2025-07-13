import React, { useEffect, useState } from 'react';
import Hero from "../components/Layout/Hero";
import GenderCollection from "../components/products/GenderCollection";
import NewArrivals from "../components/products/NewArrivals";
import ProductDetails from "../components/products/ProductDetails";
 // ✅ use correct casing
import FeaturedCollection from "../components/products/FeaturedCollection";
import FeaturesSection from "../components/products/FeaturesSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import axios from "axios";
import ProductGrid from "../components/products/ProductGrid";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        limit: 8,
      })
    );

    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch best seller", error);
      }
    };

    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollection />
      <NewArrivals />

      {/* Best Seller Section */}
      <div className="container mx-auto my-10">
        <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
        {bestSellerProduct ? (
          <ProductDetails productId={bestSellerProduct._id} />
        ) : (
          <p className="text-center">Loading best seller product...</p>
        )}
      </div>

      {/* Top Wears for Women Section */}
      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">Top Wears for Women</h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      <FeaturedCollection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
