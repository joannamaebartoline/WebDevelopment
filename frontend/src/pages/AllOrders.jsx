import React, { useEffect, useState } from "react";
import axios from "axios";

const AllOrders = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get("http://localhost:8800/orders");
            setOrders(res.data);
        } catch (err) {
            console.log("Error fetching orders:", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div>
            <h1>All Orders</h1>
            <div className="orders">
                {orders.map((order) => (
                    <div className="order" key={order.orderID}>
                        <h2>Order ID: {order.orderID}</h2>
                        <p>User ID: {order.userID}</p>
                        <p>Total Amount: ₱{order.totalAmount}</p>
                        <p>Status: {order.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllOrders;
