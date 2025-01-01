import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductModal from "../pages/ProductModal"; // Import the updated modal component
import Navbar from "../pages/Navbar";
import './navbarstyle.css';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null); // Track the selected product
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
    const navigate = useNavigate();
        
   

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
        const isLoggedIn = localStorage.getItem("user");

        if (!isLoggedIn) {
            alert("Please log in to add items to the cart.");
            navigate("/login");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const userKey = user ? user.username : null;

        let cart = JSON.parse(localStorage.getItem(`cart_${userKey}`)) || [];

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
        localStorage.setItem(`cart_${userKey}`, JSON.stringify(cart));
        alert("Product added to cart!");
    };

const isUserLoggedIn = localStorage.getItem("user");
    return (
        <>
            <Navbar />
            
            {/* Hero Section */}
            {!isUserLoggedIn && (
                <section className="hero-section">
                    <div className="hero-overlay">
                        <h1>Shop the Best Beauty Products</h1>
                        <p>Discover your perfect products for face, body, and hair.</p>

                        <button
                            onClick={() => {
                                const section = document.getElementById("home-cont");
                                if (section) {
                                    const offset = -165; 
                                    const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset + offset;
                                    window.scrollTo({ top: sectionPosition, behavior: "smooth" });
                                }
                            }}
                        >
                            Shop Now
                        </button>
                    </div>
                </section>
            )}

            <div className="home-page">
                <h1>Our Products</h1>
                <div id="home-cont" className="home-content">
                    {/* Sidebar for Categories */}
                    <div className="sidebar">
                        <h2>Categories</h2>
                        <ul>
                            <li><a href="/category/face">Face Products</a></li>
                            <li><a href="/category/eye">Eye Products</a></li>
                            <li><a href="/category/lip">Lip Products</a></li>
                            <li><a href="/category/nail">Nail Products</a></li>
                            <li><a href="/category/skincare">Skincare Essentials</a></li>
                            <li><a href="/category/tools">Tools and Accessories</a></li>
                            <li><a href="/category/body">Body Products</a></li>
                            <li><a href="/category/hair">Hair Cosmetics</a></li>
                            <li><a href="/category/fragrances">Fragrances</a></li>
                        </ul>
                        <h3>Sort by Price</h3>
                        <select className="dropdown-select">
                            <option value="">Select an option</option>
                            <option value="lowToHigh">Low to High</option>
                            <option value="highToLow">High to Low</option>
                        </select>
                    </div>

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

                            <button 
    onClick={() => handleViewDetails(product)} 
    style={{
        background: "none",
        border: "none",
        color: "green",
        cursor: "pointer",
        padding: "0",
        textDecoration: "none", 
    }}
    onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
    onMouseLeave={(e) => e.target.style.textDecoration = "none"}
>
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
