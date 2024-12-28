const express = require("express");
const router = express.Router();
const db = require("../db");  // Adjust with your database connection file

// Create new order
router.post("/", (req, res) => {
    const { userID, productID, quantity, total_price, status } = req.body;
    const query = `INSERT INTO orders (userID, productID, quantity, total_price, status) 
                   VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [userID, productID, quantity, total_price, status], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ orderID: result.insertId, ...req.body });
    });
});

// Get all orders
router.get("/", (req, res) => {
    const query = "SELECT * FROM orders";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Get order by ID
router.get("/:orderID", (req, res) => {
    const query = "SELECT * FROM orders WHERE orderID = ?";
    db.query(query, [req.params.orderID], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results[0]);
    });
});

// Update order status
router.put("/:orderID", (req, res) => {
    const { status } = req.body;
    const query = "UPDATE orders SET status = ? WHERE orderID = ?";
    db.query(query, [status, req.params.orderID], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ orderID: req.params.orderID, status });
    });
});

module.exports = router;
