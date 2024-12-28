import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);

    const fetchAllProducts = async () => {
        try {
            const res = await axios.get("http://localhost:8800/products");
            setProducts(res.data);
        } catch (err) {
            console.log("Error fetching products:", err);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const handleDelete = async (id) => {
        // Ask for confirmation before deleting the product
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8800/products/${id}`);
                fetchAllProducts();  // Re-fetch the products after deletion
            } catch (err) {
                console.log("Error deleting product:", err);
            }
        }
    };

    return (
        <div>
            {/* Navbar with links to Orders and Payments */}
            <nav>
                <ul>
                    <li><Link to="/all-orders">All Orders</Link></li>
                    <li><Link to="/all-payments">All Payments</Link></li>
                </ul>
            </nav>

            <div className="container">
                <h1>Products</h1>
                <div className="products">
                    {products.map((product) => (
                        <div className="product" key={product.productID}>
                            <img src={`http://localhost:8800${product.images}`} alt="Product" />
                            <h2>{product.title}</h2>
                            <p>{product.description}</p>
                            <span>₱{product.price}</span>
                            <span>Category: {product.category}</span>
                            <button onClick={() => handleDelete(product.productID)}>Delete</button>
                            <Link to={`/update/${product.productID}`}>
                                <button>Update</button>
                            </Link>
                        </div>
                    ))}
                </div>
                <Link to="/add">
                    <button>Add New Product</button>
                </Link>
            </div>
        </div>
    );
};

export default Products;
