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
    const [selectedCategory, setSelectedCategory] = useState(""); 
    const [selectedPriceRange, setSelectedPriceRange] = useState(""); 
    const [categories, setCategories] = useState([]); 

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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:8800/categories");
                setCategories(res.data); // Store categories in state
            } catch (err) {
                console.log("Error fetching categories:", err);
            }
        };
        fetchCategories();
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
    
    
    const filterByPriceRange = (price) => {
        if (!selectedPriceRange) return true; 
    
        const priceRanges = {
            under500: 500,
            "500-1000": [500, 1000],
            "1000-5000": [1000, 5000],
            "5000plus": 5000,
        };
    
        const range = priceRanges[selectedPriceRange];
    
        if (Array.isArray(range)) {
            return price >= range[0] && price <= range[1];
        } else if (selectedPriceRange === "under500") {
            return price < range;
        } else if (selectedPriceRange === "5000plus") {
            return price >= range;
        }
    
        return true;
    };
    
    const filteredProducts = products.filter((product) => {
        const isCategoryMatch = selectedCategory
            ? product.categoryID === parseInt(selectedCategory)
            : true;
    
        const isPriceMatch = filterByPriceRange(product.price);
    
        return isCategoryMatch && isPriceMatch;
    });
    
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

<div className="filters">
    {/* Category Filter */}
    <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
    >
        <option value="">All Categories</option>
        {categories.map((cat) => (
            <option key={cat.categoryID} value={cat.categoryID}>
                {cat.name}
            </option>
        ))}
    </select>

    {/* Price Range Filter */}
    <select
        value={selectedPriceRange}
        onChange={(e) => setSelectedPriceRange(e.target.value)}
    >
        <option value="">All Prices</option>
        <option value="under500">Under ₱500</option>
        <option value="500-1000">₱500 - ₱1000</option>
        <option value="1000-5000">₱1000 - ₱5000</option>
        <option value="5000plus">₱5000 and above</option>
    </select>
</div>


            <div className="home-page">
                <h1>Our Products</h1>
                <div id="home-cont" className="home-content">
                <div className="product-cards">
    {filteredProducts.map((product) => (
        <div className="product-card" key={product.productID}>
            <img
                src={`http://localhost:8800${product.images}`}
                alt={product.title}
            />
            <h2>{product.title}</h2>
            <span>₱{product.price}</span>
            <button className="details-btn"
                onClick={() => handleViewDetails(product)}
                onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
                View Details
            </button>
            <div className="button-container">
                <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product, 1)}
                >
                    <img
                        src={require("../assets/add-to-cart-icon.png")}
                        alt="Add to Cart"
                        className="cart-icon-img"
                    />
                </button>
                <button
                    className="buy-now-btn"
                    onClick={() => handleBuyNow(product, 1)}
                >
                    Buy Now
                </button>
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