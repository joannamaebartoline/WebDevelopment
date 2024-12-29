import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

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

// User Signup
app.post('/signup', async (req, res) => {
    const { name, email, password, role = 'user' } = req.body;
    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json("All fields are required.");
    }

    // Check if the email already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json("Error checking email.");

        if (result.length > 0) {
            return res.status(400).json("Email already exists.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const q = "INSERT INTO users (`username`, `email`, `password`, `role`) VALUES (?)";
        const values = [name, email, hashedPassword, role];

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
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json("Error fetching user.");
        if (result.length === 0) return res.status(400).json("User not found.");

        const user = result[0];

        // Compare the entered password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json("Invalid credentials.");
        }

        // Create JWT token
        const token = jwt.sign({ userId: user.id, role: user.role }, 'your-secret-key', { expiresIn: '1h' });

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
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
