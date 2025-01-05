import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminNavbar from "./AdminNavbar"; 

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
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8800/products/${id}`);
                fetchAllProducts();
            } catch (err) {
                console.log("Error deleting product:", err);
            }
        }
    };

    return (
        <div>
            <AdminNavbar />  
            <div className="page-container">
                <div className="content-container">
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
                    </div>
                    <Link to="/add" className="add-container">
                        <button>Add New Product</button>
                    </Link>
                </div>
            </div>
        </div>
    );
    
};

export default Products;
