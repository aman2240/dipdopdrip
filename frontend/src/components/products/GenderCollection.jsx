import React from 'react'
import mensCollectionImage from "../../assets/mens-collection.webp"
import womensCollectionImage from "../../assets/womens-collection.webp"
import { Link } from "react-router-dom"

const GenderCollection = () => {
  return (
    <>
      {/* Section Heading */}
      <section className="bg-white pt-20 pb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Discover by Category
        </h2>
        <p className="text-sm md:text-base text-gray-600 mt-2">
          Shop the latest looks curated for men and women
        </p>
      </section>

      {/* Collection Grid */}
      <section className="pb-16 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Women's Collection */}
          <div className="relative group overflow-hidden rounded-2xl shadow-xl">
            <img
              src={womensCollectionImage}
              alt="Women's Collection"
              className="w-full h-[350px] sm:h-[400px] lg:h-[520px] object-cover brightness-110 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition duration-300" />
            <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md text-gray-900 p-6 rounded-xl max-w-[75%] shadow-lg">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2">
                Women's Collection
              </h2>
              <Link
                to="/collections/all?gender=Women"
                className="inline-block mt-2 font-medium underline underline-offset-4 hover:text-pink-500 transition"
              >
                Shop Now →
              </Link>
            </div>
          </div>

          {/* Men's Collection */}
          <div className="relative group overflow-hidden rounded-2xl shadow-xl">
            <img
              src={mensCollectionImage}
              alt="Men's Collection"
              className="w-full h-[350px] sm:h-[400px] lg:h-[520px] object-cover brightness-110 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition duration-300" />
            <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md text-gray-900 p-6 rounded-xl max-w-[75%] shadow-lg">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2">
                Men's Collection
              </h2>
              <Link
                to="/collections/all?gender=Men"
                className="inline-block mt-2 font-medium underline underline-offset-4 hover:text-blue-500 transition"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default GenderCollection
