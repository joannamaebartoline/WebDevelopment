import React, { useState } from "react";
import "./modalstyle.css";

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1); // State to manage quantity

    if (!isOpen || !product) return null; // Don't render if modal is closed or no product is provided

    const handleAddToCart = () => {
        if (quantity <= 0) {
            alert("Please select a valid quantity.");
            return;
        }

        onAddToCart(product, quantity); // Pass product and quantity to parent handler
        onClose(); // Close the modal after adding to cart
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

                {/* Add to Cart Button */}
                <button onClick={handleAddToCart} style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductModal;
