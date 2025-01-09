import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductModal from "../pages/ProductModal"; // Import the updated modal component
import Navbar from "../pages/Navbar";
import './homestyle.css';
import { useNavigate } from "react-router-dom";


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
const navigate = useNavigate();
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
        
        console.log("Updated Cart:", cart);
        alert("Product added to cart!");
    };

    
    const handleBuyNow = (product, quantity = 1) => {
        const isLoggedIn = localStorage.getItem("user");
        if (!isLoggedIn) {
            alert("Please log in to proceed to checkout.");
            navigate("/login");
            return;
        }
    
        const user = JSON.parse(localStorage.getItem("user"));
        const userKey = user ? user.username : null;
    
    
        const checkoutProduct = {
            ...product,
            quantity,
        };

        const totalAmount = checkoutProduct.price * checkoutProduct.quantity;
    
        localStorage.setItem(`buyNow_${userKey}`, JSON.stringify([checkoutProduct]));
    
        navigate("/checkout", { state: { checkoutItems: [checkoutProduct], totalAmount } });
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
<div className="button-container">
                             <button className="add-to-cart-btn" onClick={() => handleAddToCart(product, 1)}> 
                             <img 
                src={require("../assets/add-to-cart-icon.png")} // Adjust the path based on your project structure
                alt="Add to Cart"
                className="cart-icon-img"
            />
                            </button >
                            <button className="buy-now-btn" onClick={() => handleBuyNow(product, 1)}>Buy Now</button> 
                        </div>
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