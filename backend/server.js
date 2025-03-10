import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import ordersRoutes from './routes/orders';  // Import orders routes

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
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json("No file uploaded.");
    res.status(200).json({ filePath: `/uploads/${file.filename}` });
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

// Use orders routes
app.use("/orders", ordersRoutes);  // This line connects the order routes

// Start the server
app.listen(8800, () => {
    console.log("Server is running on port 8800.");
});
