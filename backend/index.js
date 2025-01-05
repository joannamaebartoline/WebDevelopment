import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';



const app = express();

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "wannamae",
    database: "test",
});

db.connect((err) => {
    if (err) console.log("Error connecting to the database:", err);
    else console.log("Connected to the database.");
});

app.use(express.json());
app.use(cors());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // Save to uploads folder
    },
    filename: (req, file, cb) => {
        // Check if file already exists
        const filePath = path.join('uploads', file.originalname);
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // If file doesn't exist, use the original file name
                cb(null, Date.now() + path.extname(file.originalname));
            } else {
                // If file exists, send a response indicating the file already exists
                cb(null, file.originalname); // Or any custom naming logic here
            }
        });
    },
});

const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json("No file uploaded.");
    res.status(200).json({ filePath: `/uploads/${file.filename}` });
});

let orders = [];

app.post("/orders", (req, res) => {
    const { userID, userName, userAddress, paymentMethod, status, checkoutItems, totalAmount } = req.body;

    const orderQuery = `INSERT INTO orders (userID, userName, userAddress, paymentMethod, status, totalAmount, orderDate) VALUES (?, ?, ?, ?, ?, ?, NOW())`;

    db.query(orderQuery, [userID, userName, userAddress, paymentMethod, status, totalAmount], (err, result) => {
        if (err) {
            console.log("Error inserting order:", err);
            return res.status(500).json({ message: "Error placing the order." });
        }

        const orderID = result.insertId;

        checkoutItems.forEach(item => {
            const itemQuery = `INSERT INTO order_items (orderID, productID, title, price, quantity) VALUES (?, ?, ?, ?, ?)`;

            db.query(itemQuery, [orderID, item.productID, item.title, item.price, item.quantity], (err) => {
                if (err) {
                    console.log("Error inserting order item:", err);
                    return res.status(500).json({ message: "Error adding order items." });
                }
            });
        });

        res.status(201).json({ message: "Order placed successfully", orderID });
    });
});

app.get("/orders", (req, res) => {
    const query = `
    SELECT orders.orderID, orders.userID, orders.userName, orders.userAddress, orders.paymentMethod, orders.status, orders.totalAmount, orders.orderDate,
           order_items.productID, order_items.title, order_items.price, order_items.quantity
    FROM orders
    LEFT JOIN order_items ON orders.orderID = order_items.orderID
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.log("Error fetching orders:", err);
            return res.status(500).json({ message: "Error fetching orders." });
        }

        // Group the results by orderID to create a structure with checkoutItems
        const orders = result.reduce((acc, row) => {
            let order = acc.find(o => o.orderID === row.orderID);
            if (!order) {
                order = {
                    orderID: row.orderID,
                    userID: row.userID,
                    userName: row.userName,
                    userAddress: row.userAddress,
                    paymentMethod: row.paymentMethod,
                    status: row.status,
                    totalAmount: row.totalAmount,
                    orderDate: row.orderDate,
                    checkoutItems: []
                };
                acc.push(order);
            }
            order.checkoutItems.push({
                productID: row.productID,
                title: row.title,
                price: row.price,
                quantity: row.quantity
            });
            return acc;
        }, []);

        res.json(orders);
    });
});
app.put("/orders/:orderID", (req, res) => {
    const { orderID } = req.params;
    const { status } = req.body;

    // Validate status (Optional: depending on your use case)
    const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled", "Received"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status." });
    }

    // Update order status in the database
    const query = `UPDATE orders SET status = ? WHERE orderID = ?`;

    db.query(query, [status, orderID], (err, result) => {
        if (err) {
            console.log("Error updating order status:", err);
            return res.status(500).json({ message: "Error updating the order status." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.json({ message: "Order status updated successfully." });
    });
});

// User Signup
app.post('/signup', async (req, res) => {
    const { username, email, password, phone_number, address } = req.body;

    // Basic validation
    if (!username || !email || !password || !phone_number || !address) {
        return res.status(400).json("All fields are required.");
    }

    // Check if the email already exists
    db.query("SELECT * FROM customers WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json("Error checking email.");

        if (result.length > 0) {
            return res.status(400).json("Email already exists.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const q = "INSERT INTO customers (`username`, `email`, `password`, `phone_number`, `address`) VALUES (?)";
        const values = [username, email, hashedPassword, phone_number, address];

        db.query(q, [values], (err) => { 
            if (err) {
                console.log("Error inserting user:", err);
                return res.status(500).json("Error saving user.");
            }
            res.status(201).json("User has been created successfully.");
        });
    });
});

// User Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json("Email and password are required.");
    }

    // Check if the user exists in the database
    db.query("SELECT * FROM customers WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json("Error fetching user.");
        if (result.length === 0) return res.status(400).json("User not found.");

        const user = result[0];

        // Compare the entered password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json("Invalid credentials.");
        }

        // Create JWT token
        const token = jwt.sign({ userId: user.userID }, 'your-secret-key', { expiresIn: '1h' });

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.userID, username: user.username, email: user.email, address: user.address, phone_number: user.phone_number }
        });
    }); 
});

// Admin Login
app.post('/adminlogin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json("Email and password are required.");
    }

    // Check if the user exists in the database
    db.query("SELECT * FROM admin WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json("Error fetching user.");
        if (result.length === 0) return res.status(400).json("User not found.");

        const user = result[0];

        if (password !== user.password) {
            return res.status(400).json("Invalid credentials.");
        }

        res.status(200).json({
            message: "Login successful",
            user: { id: user.adminID, username: user.username, email: user.email }
        });
    });
});

// Add product
app.post("/products", (req, res) => {
    const { title, description, price, images, category } = req.body;

    // Basic validation
    if (!title || !description || !price || !category) {
        return res.status(400).json("All fields are required.");
    }

    if (isNaN(price) || price <= 0) {
        return res.status(400).json("Price must be a valid positive number.");
    }

    const q = "INSERT INTO products (`title`, `description`, `price`, `images`, `category`) VALUES (?)";
    const values = [title, description, price, images, category];

    db.query(q, [values], (err) => {
        if (err) {
            console.log("Error inserting product:", err);
            return res.status(500).json(err);
        }
        res.status(201).json("Product has been added successfully.");
    });
});
app.get('/products/category/:category', (req, res) => {
    const { category } = req.params;

    const q = "SELECT * FROM products WHERE category = ?";
    db.query(q, [category], (err, data) => {
        if (err) {
            console.log("Error fetching products by category:", err);
            return res.status(500).json(err);
        }
        res.status(200).json(data);
    });
});
// Update product
app.put("/products/:id", (req, res) => {
    const productID = req.params.id;
    const { title, description, price, images, category } = req.body;

    if (!title || !description || !price || !category) {
        return res.status(400).json("All fields are required.");
    }

    if (isNaN(price) || price <= 0) {
        return res.status(400).json("Price must be a valid positive number.");
    }

    const q = "UPDATE products SET `title` = ?, `description` = ?, `price` = ?, `images` = ?, `category` = ? WHERE productID = ?";
    const values = [title, description, price, images, category];

    db.query(q, [...values, productID], (err) => {
        if (err) {
            console.log("Error updating product:", err);
            return res.status(500).json(err);
        }
        res.status(200).json("Product has been updated successfully.");
    });
});

// Fetch all products
app.get("/products", (req, res) => {
    const q = "SELECT * FROM products";
    db.query(q, (err, data) => {
        if (err) {
            console.log("Error fetching products:", err);
            return res.status(500).json(err);
        }
        res.status(200).json(data);
    });
});

// Delete product
app.delete('/products/:id', (req, res) => {
    const q = "DELETE FROM products WHERE productID = ?";
    db.query(q, [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.status(200).json("Product has been deleted.");
    });
});

// Example with Express.js
app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    // Fetch the product from the database using the ID
    db.query('SELECT * FROM products WHERE productID = ?', [productId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (results.length > 0) {
            return res.json(results[0]); // Send the product data as JSON
        } else {
            return res.status(404).json({ message: 'Product not found' });
        }
    });
});


// Start the server
app.listen(8800, () => {
    console.log("Server is running on port 8800.");
});
