import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductModal from "../pages/ProductModal"; // Import the updated modal component
import Navbar from "../pages/Navbar";
import './navbarstyle.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null); // Track the selected product
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:8800/products");
                setProducts(res.data);
            } catch (err) {
                console.log("Error fetching products:", err);
            }
        };
        fetchProducts();
    }, []);

    const handleViewDetails = (product) => {
        setSelectedProduct(product); // Set the clicked product
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
        setSelectedProduct(null); // Reset the selected product
    };

    const handleAddToCart = (product, quantity) => {
        // Get current cart items from localStorage
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Check if the product is already in the cart
        const existingProductIndex = cart.findIndex(item => item.productID === product.productID);
        if (existingProductIndex >= 0) {
            // Update the quantity if product already exists
            cart[existingProductIndex].quantity += quantity;
        } else {
            // Add new product to cart
            cart.push({ ...product, quantity });
        }

        // Save updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product added to cart!");
    };

    return (
        <>
            <Navbar />
            
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay">
                    <h1>Shop the Best Beauty Products</h1>
                    <p>Discover your perfect products for face, body, and hair.</p>
                    <button>Shop Now</button>
                </div>
            </section>

            <div className="home-page">
                <h1>Our Products</h1>
                <div className="product-cards">
                    {products.map((product) => (
                        <div className="product-card" key={product.productID}>
                            <img
                                src={`http://localhost:8800${product.images}`}
                                alt={product.title}
                            />
                            <h2>{product.title}</h2>
                            <span>₱{product.price}</span>

                            {/* Display product rating */}
                            <div className="product-rating">
                                {product.rating ? (
                                    <>
                                        <span>{product.rating}</span> 
                                        {/* Optional: Display stars for the rating */}
                                        <div className="stars">
                                            {[...Array(5)].map((_, index) => (
                                                <span key={index} className={index < product.rating ? "filled" : "empty"}>★</span>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <span>No ratings yet</span>
                                )}
                            </div>

                            <button onClick={() => handleViewDetails(product)}>
                                View Details
                            </button>
                             {/* Add to Cart Button */}
                             <button onClick={() => handleAddToCart(product, 1)}> {/* Default quantity set to 1 */}
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for displaying product details */}
            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAddToCart={handleAddToCart}
            />
        </>
    );
};

export default Home;
