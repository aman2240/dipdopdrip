import axios from "axios";
import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { Link } from "react-router-dom"

const NewArrivals = () => {
  const scrollRef =useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(false)
  const [canscrollLeft, setCanScrollLeft] = useState(false)
  const [canscrollRight, setCanScrollRight] = useState(false)
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
        setNewArrivals(response.data);
      } catch (error) {
        console.error(error);
        
      }
    };
    fetchNewArrivals();
  }, []);


const handleMouseDown = (e) => {
  setIsDragging(true);
  setStartX(e.pageX - scrollRef.current.offsetLeft);
  setScrollLeft(scrollRef.current.scrollLeft);
};

const handleMouseMove = (e) => {
  if (!isDragging) return;
  const x = e.pageX -scrollRef.current.offsetLeft;
  const walk = x -startX;
  scrollRef.current.scrollLeft = scrollLeft - walk;

};

const handleMouseUpOrLeave = () => {
  setIsDragging(false);

}


const scroll =(direction) => {
  const scrollAmount = direction === "left" ? -300 : 300;
  scrollRef.current.scrollBy({ left: scrollAmount, behaviour: "smooth"  });
}

//Update scroll buttons
const updateScrollButtons = () => {
  const container = scrollRef.current;
  if (container) {
    const leftScroll = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    // Define a small threshold to account for floating-point inaccuracies
    const threshold = 5;

    setCanScrollLeft(leftScroll > threshold);
    setCanScrollRight(leftScroll < maxScrollLeft - threshold);
  }
};


 useEffect(() => {
  const container = scrollRef.current;
  if(container){
    container.addEventListener("scroll",updateScrollButtons)
    updateScrollButtons();
    return () => container.removeEventListener("scroll", updateScrollButtons);
  }
 }, [newArrivals]);

  return <section className="py-16 px-4 lg:px-0">
    <div className="container mx-auto text-center mb-10 relative">
      <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
      <p className="text-lg text-gray-600 mb-8">
        Discover the latest styles straight off the runaway, freshly added to kep your wardrobe on the cutting edge of fashion. 
      </p>

      {/* Scroll Buttons  */}
      <div className="absolute right-0 bottom-[-30px] flex space-x-2 ">
      <button onClick={() => scroll("left")}
      disabled={!canscrollLeft}
      className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 ${canscrollLeft ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"} shadow hover:shadow-md hover:shadow-gray-400 hover:scale-105 transition-all duration-200`}>
        <FiChevronLeft className="text-2xl" />
      </button>

      <button onClick={() => scroll("right")}
      className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 ${canscrollRight ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"} shadow hover:shadow-md hover:shadow-gray-400 hover:scale-105 transition-all duration-200`}>
        <FiChevronRight className="text-2xl" />
      </button>
      </div>
    </div>

    {/* Scrollable Content  */}
    <div ref={scrollRef} className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUpOrLeave}
    onMouseLeave={handleMouseUpOrLeave}
    >
      {newArrivals.map((product) => (
        <div key={product._id} className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative">
          <img
  src={
  product.images
    ? Object.values(product.images)?.[0]?.[0]
    : ""
}

  alt={product.name}


          className="w-full h-[400px] object-cover rounded-lg" 
          draggable="false"/>
          <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
            <Link to={`/product/${product._id}`} className="block">
              <h4 className="font-medium">{product.name}</h4>
              {product.discountPrice ? (
  <p className="mt-1 text-gray-900 font-semibold">
    ₹ {product.discountPrice}{" "}
    <span className="text-sm text-gray-300 line-through ml-2">
      ₹ {product.price}
    </span>
  </p>
) : (
  <p className="mt-1 font-semibold">₹ {product.price}</p>
)}

            </Link>
          </div>
        </div>
      ))}
    </div>

  </section>
}

export default NewArrivals