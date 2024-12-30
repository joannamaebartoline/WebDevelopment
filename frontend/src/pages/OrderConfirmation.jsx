import React from 'react';
import { useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
    const location = useLocation();
    const { orderID, totalAmount, items } = location.state || {};

    if (!location.state) {
        return <p>No order data available. Please place an order first.</p>;
    }

    return (
        <div className="container">
            <h1>Order Confirmation</h1>
            <p>Your order has been placed successfully!</p>
            <p><strong>Order ID:</strong> {orderID || "N/A"}</p>
            <p><strong>Total Amount:</strong> ₱{(totalAmount || 0).toFixed(2)}</p>

            <h2>Order Details</h2>
            {items && items.length > 0 ? (
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            {item.title} x {item.quantity} - ₱{(item.price * item.quantity).toFixed(2)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No items in your order.</p>
            )}
        </div>
    );
};

export default OrderConfirmation;
