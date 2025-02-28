import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../pages/Navbar";
import "./ordersstyle.css"
import { useNavigate } from "react-router-dom";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedOrderID, setSelectedOrderID] = useState(null);
    const [cancelReason, setCancelReason] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [selectedProductID, setSelectedProductID] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [comment, setComment] = useState("");
    const alertShown = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser && !alertShown.current) {
            alert("Please log in to view your orders.");
            alertShown.current = true;
            navigate("/login");
        } else if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser.user);
        }
    }, [navigate]);

    useEffect(() => {
        if (user) { 
            axios.get("http://localhost:8800/orders")
                .then((response) => {
                    const userOrders = response.data.filter((order) => order.userID === user.id);
                    console.log(userOrders);
                    setOrders(userOrders);
                })
                .catch((error) => {
                    console.error("Error fetching orders:", error);
                });
        }
    }, [user]);

    const openRatingModal = (orderID, productID) => {
        setSelectedOrderID(orderID);
        setSelectedProductID(productID);
        setShowRatingModal(true);
    };


    const filteredOrders =
    selectedStatus === "All"
        ? orders
        : orders.filter((order) => order.status === selectedStatus);

    const closeRatingModal = () => {
        setShowRatingModal(false);
        setRating(0);
    };

    const handleOrderReceived = (orderID, productID) => {
        const confirmRating = window.confirm("Would you like to provide a rating for this product?");
        if (confirmRating) {
            openRatingModal(orderID, productID); // Use the function here
        } else {
            axios.put(`http://localhost:8800/orders/${orderID}`, {
                status: "Received",
                ratingGiven: false
            })
            .then((response) => {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.orderID === orderID
                            ? { ...order, status: response.data.order.status, ratingGiven: false }
                            : order
                    )
                );
                alert("Order marked as received.");
            })
            .catch((error) => {
                console.error("Error updating order status:", error);
                alert("Failed to update order status. Please try again.");
            });
        }
    };
    
    const submitRating = () => {
        axios.post("http://localhost:8800/ratings", {
            productID: selectedProductID, 
            userID: user.id,
            rating: rating,
            comment: comment || "" 
        })
        .then(() => {
            // Update the order status to "Received" and remove the "Order Received" button
            axios.put(`http://localhost:8800/orders/${selectedOrderID}`, {
                status: "Received", // Update status to "Received"
                ratingGiven: true
            })
            .then((response) => {
                // Directly update the order status in the local state with the updated order data
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.orderID === selectedOrderID
                            ? { ...order, ratingGiven: true, status: "Received" }  // Use the updated status from the backend response
                            : order
                    )
                );
                alert("Thank you for your feedback!");
                closeRatingModal();
            })
            .catch((error) => {
                console.error("Error updating order status:", error);
                alert("Failed to update order status. Please try again.");
            });
        })
        .catch((error) => {
            console.error("Error submitting rating:", error);
            alert("Failed to submit your rating. Please try again.");
        });
    };
    
   
    const openCancelModal = (orderID) => {
        setSelectedOrderID(orderID);
        setShowCancelModal(true);
    };

    const closeCancelModal = () => {
        setSelectedOrderID(null);
        setCancelReason("");
        setShowCancelModal(false);
    };

    const submitCancelReason = () => {
        if (!cancelReason) {
            alert("Please select a reason for canceling the order.");
            return;
        }

        axios.put(`http://localhost:8800/orders/${selectedOrderID}`, {
            status: "Cancelled",
            cancelReason: cancelReason
        })
        .then((response) => {
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.orderID === selectedOrderID ? { ...order, status: "Cancelled" } : order
                )
            );
            alert("Order canceled successfully.");
            closeCancelModal();
        })
        .catch((error) => {
            console.error("Error canceling order:", error);
        });
    };
    
    return (
        <div>
            <Navbar />
            <div className="orders-container">
                <h1>Orders</h1>
                <div className="filter-container">
                    <label htmlFor="status-filter">Filter by Status:</label>
                    <select
                        id="status-filter"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Received">Received</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                {filteredOrders.length === 0 ? (
                    <p>No orders found for the selected status.</p>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.orderID} className="order-details">
                            <p>
                                <strong>Status:</strong> {order.status}
                            </p>
                            <h3>Items:</h3>
                            <div className="order-items-container">
                                {order.checkoutItems.map((item, index) => (
                                    <div key={index} className="order-item-card">
                                        <img
                                            src={`http://localhost:8800${item.images}`}
                                            alt={item.title}
                                        />
                                        <p className="order-item-title">{item.title}</p>
                                        <p className="order-item-price">
                                            ₱
                                            {item.price && !isNaN(item.price)
                                                ? item.price.toFixed(2)
                                                : "0.00"}
                                        </p>
                                        <p className="order-item-quantity">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <p>
                                <strong>Total Amount:</strong> ₱
                                {order.totalAmount && !isNaN(order.totalAmount)
                                    ? order.totalAmount.toFixed(2)
                                    : "0.00"}
                            </p>
                            {order.status === "Delivered" && (
    <button
        className="order-received-button"
        onClick={() =>
            handleOrderReceived(order.orderID, order.checkoutItems[0]?.productID)
        }
    >
        Order Received
    </button>
)}

                            {order.status === "Pending" && (
                                <button
                                    className="order-cancel-button"
                                    onClick={() => openCancelModal(order.orderID)}
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
            {showRatingModal && (
                <div className="rating-modal">
                    <div className="modal-content">
                        <h2>Rate your order</h2>
                        <div className="star-container">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={star <= rating ? "star-filled" : "star-empty"}
                                    onClick={() => setRating(star)}
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "24px",
                                        color: star <= rating ? "gold" : "gray",
                                    }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            className="comment"
                            placeholder="Leave a comment (optional)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button className="rating-submit-button" onClick={submitRating}>
                                Submit
                            </button>
                            <button className="rating-close-button" onClick={closeRatingModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showCancelModal && (
                <div className="cancel-modal">
                    <div className="modal-content">
                        <h2>Why do you want to cancel this order?</h2>
                        <select
                            className="cancel-reason-select"
                            onChange={(e) => setCancelReason(e.target.value)}
                            value={cancelReason}
                        >
                            <option value="">Select a reason</option>
                            <option value="Changed my mind">Changed my mind</option>
                            <option value="Found a better price elsewhere">
                                Found a better price elsewhere
                            </option>
                            <option value="Delivery is taking too long">
                                Delivery is taking too long
                            </option>
                            <option value="Ordered by mistake">Ordered by mistake</option>
                            <option value="Others">Others</option>
                        </select>
                        {cancelReason === "Others" && (
                            <textarea
                                className="cancel-reason-textarea"
                                placeholder="Please specify your reason..."
                                onChange={(e) => setCancelReason(e.target.value)}
                            />
                        )}
                        <div className="modal-actions">
                            <button className="cancel-submit-button" onClick={submitCancelReason}>
                                Submit
                            </button>
                            <button className="cancel-close-button" onClick={closeCancelModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
