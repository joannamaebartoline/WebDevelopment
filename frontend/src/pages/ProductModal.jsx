import React, { useState } from "react";
import "./modalstyle.css";
import { useNavigate } from "react-router-dom";

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1); 
const navigate = useNavigate();

    if (!isOpen || !product) return null; 

    const handleAddToCart = () => {
        if (quantity <= 0) {
            alert("Please select a valid quantity.");
            return;
        }

        onAddToCart(product, quantity); // Pass product and quantity to parent handler
        onClose(); // Close the modal after adding to cart
    };

    const handleBuyNow = () => {
        if (quantity <= 0) {
            alert("Please select a valid quantity.");
            return;
        }
    
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
    

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-button" onClick={onClose}>
                    &times;
                </button>
                <h1>{product.title}</h1>
                <img
                    src={`http://localhost:8800${product.images}`}
                    alt={product.title}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <p>{product.description}</p>
                <span>₱{product.price}</span>

                {/* Quantity Input */}
                <div style={{ margin: "15px 0" }}>
                    <label style={{ marginRight: "10px" }}>Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        min="1"
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        style={{
                            padding: "5px",
                            width: "60px",
                            textAlign: "center",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                        }}
                    />
                </div>
                        <div class="button-container">
                {/* Add to Cart Button */}
                <button className="add-to-cart-btn-modal" onClick={() => handleAddToCart(product, 1)}> 
                             <img 
                src={require("../assets/add-to-cart-icon.png")} // Adjust the path based on your project structure
                alt="Add to Cart"
                className="cart-icon-img"
            />
                            </button >
                <button className="buy-now-btn-modal" onClick={handleBuyNow} >
                    Buy Now
                </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
