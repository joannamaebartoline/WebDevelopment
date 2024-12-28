import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!address || !paymentMethod) {
            alert("Please fill in all fields.");
            return;
        }
        console.log("Order submitted", { address, paymentMethod });
        navigate("/order-confirmation");
    };

    return (
        <div className="container">
            <h1>Checkout</h1>
            <form className="checkout-page">
                <label>Shipping Address</label>
                <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter shipping address"
                />
                <label>Payment Method</label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="">Select Payment Method</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
                <button type="button" onClick={handleCheckout}>Place Order</button>
            </form>
        </div>
    );
};

export default Checkout;
