import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminNavbar from "./AdminNavbar"; 
import "./productsstyle.css" 

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedPriceRange, setSelectedPriceRange] = useState("");

    const fetchAllProducts = async () => {
        try {
            const res = await axios.get("http://localhost:8800/products");
            setProducts(res.data);
        } catch (err) {
            console.log("Error fetching products:", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://localhost:8800/categories");
            setCategories(res.data); // Set the categories data
        } catch (err) {
            console.log("Error fetching categories:", err);
        }
    };

    useEffect(() => {
        fetchAllProducts();
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (confirmDelete) {
            try {
                console.log("Sending DELETE request for productID:", id); // Debugging line
                await axios.delete(`http://localhost:8800/products/${id}`);
                fetchAllProducts();
            } catch (err) {
                console.log("Error deleting product:", err);
            }
        }
    };    

    const getCategoryNameById = (categoryID) => {
        const category = categories.find((cat) => cat.categoryID === categoryID);
        return category ? category.name : "Unknown"; // Return "Unknown" if category not found
    };
    const filterByPriceRange = (price) => {
        if (!selectedPriceRange) return true; // If no price range selected, don't filter by price

        // Define price ranges
        const priceRanges = {
            "under500": 500,
            "500-1000": [500, 1000],
            "1000-5000": [1000, 5000],
            "5000plus": 5000
        };

        // Check if the product price is in the selected price range
        const range = priceRanges[selectedPriceRange];

        if (Array.isArray(range)) {
            return price >= range[0] && price <= range[1];
        } else if (selectedPriceRange === "under500") {
            return price < range;
        } else if (selectedPriceRange === "5000plus") {
            return price >= range;
        }

        return true;
    };

    const filteredProducts = products.filter((product) => {
        const isCategoryMatch = selectedCategory
            ? product.categoryID === parseInt(selectedCategory)
            : true;

        const isPriceMatch = filterByPriceRange(product.price);

        return isCategoryMatch && isPriceMatch;
    });

    return (
        <div>
            <AdminNavbar />
            <div className="page-container">
                <div className="content-container">
                    <h1>Products</h1>
                    
                    {/* Filters Section */}
                    <div className="filters-product">
                        <select
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setSelectedPriceRange(""); // Optionally reset price range when category changes
                            }}
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.categoryID} value={cat.categoryID}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <select
                            onChange={(e) => setSelectedPriceRange(e.target.value)}
                        >
                            <option value="">All Prices</option>
                            <option value="under500">Under ₱500</option>
                            <option value="500-1000">₱500 - ₱1000</option>
                            <option value="1000-5000">₱1000 - ₱5000</option>
                            <option value="5000plus">₱5000 and above</option>
                        </select>
                    </div>

                    {/* Products Display Section */}
                    <div className="products">
                        {filteredProducts.map((product) => (
                            <div className="product" key={product.productID}>
                                <img src={`http://localhost:8800${product.images}`} alt="Product" />
                                <h2>{product.title}</h2>
                                <p>{product.description}</p>
                                <span>₱{product.price}</span>
                                <span>Stock: {product.stock}</span>
                                <p style={{ color: product.stock === 0 ? 'gray' : (product.stock <= 5 ? 'red' : 'green') }}>
    {product.stock === 0 ? "No Stock" : (product.stock <= 5 ? "Low Stock!" : "In Stock")}
</p>
                                <span>Category: {getCategoryNameById(product.categoryID)}</span>
                                <div className="button-container">
                                <button className="delete-btn" onClick={() => handleDelete(product.productID)}>Delete</button>
                                <Link to={`/update/${product.productID}`}>
                                    <button className="update-btn">Update</button>
                                </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <Link to="/add" className="add-container">
                        <button className="add-new-btn">Add New Product</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Products;