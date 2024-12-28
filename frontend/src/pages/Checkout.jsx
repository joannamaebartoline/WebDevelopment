import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';  // To get the passed state
import { useNavigate } from 'react-router-dom';


const Checkout = () => {
    const location = useLocation();
    const { checkoutItems, totalAmount } = location.state || {};  // Get the items and total from state
    const navigate = useNavigate();
    // State for managing address and payment method
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    // Handle the checkout form submission
    const handleCheckout = () => {
        if (!address || !paymentMethod) {
            alert("Please fill in all fields."); // Alert if any field is missing
            return;
        }

        // You can process the order here (e.g., save to backend or payment service)
        console.log("Order submitted", { address, paymentMethod });

        // Redirect to order confirmation page after successful checkout
        navigate("/order-confirmation");
    };

    return (
        <div className="container">
            <h1>Checkout</h1>
            <form className="checkout-page">
                {/* Shipping Address Input */}
                <label>Shipping Address</label>
                <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)} // Update state on input change
                    placeholder="Enter shipping address"
                />

                {/* Payment Method Selection */}
                <label>Payment Method</label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)} // Update payment method on selection change
                >
                    <option value="">Select Payment Method</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                </select>

                {/* Display selected items */}
                <h2>Order Summary</h2>
                <ul>
                    {checkoutItems.map((item) => (
                        <li key={item.productID}>
                            {item.title} x {item.quantity} - ₱{(item.price * item.quantity).toFixed(2)}
                        </li>
                    ))}
                </ul>

                <h3>Total: ₱{totalAmount.toFixed(2)}</h3>

                {/* Checkout Button */}
                <button type="button" onClick={handleCheckout}>Place Order</button>
            </form>
        </div>
    );
};

export default Checkout;
