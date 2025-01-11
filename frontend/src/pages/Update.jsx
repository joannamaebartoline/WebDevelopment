import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./updatestyle.css"

const Update = () => {
    const { id } = useParams(); // Get product ID from URL params
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        title: "",
        description: "",
        price: "",
        categoryID: "",
        images: "",
        stock: "",
    });

    const [file, setFile] = useState(null); // Track the uploaded file
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:8800/categories");
                setCategories(res.data);  // Set the categories fetched from the backend
            } catch (err) {
                console.log("Error fetching categories:", err);
            }
        };
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/products/${id}`);
                if (res.data) {
                    setProduct(res.data);  
                }
            } catch (err) {
                console.log("Error fetching product:", err);
            }
        };
        fetchCategories();
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Handle the file change
    };

    const handleClick = async (e) => {
        e.preventDefault();

        let imageUrl = product.images; // If no new image, use the existing one

        // If a new file is selected, upload it
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                const uploadRes = await axios.post("http://localhost:8800/upload", formData);
                imageUrl = uploadRes.data.filePath; // Get the file path from response
            } catch (err) {
                console.log("Error uploading file:", err);
                return;
            }
        }

        try {
            await axios.put(`http://localhost:8800/products/${id}`, {
                ...product,
                images: imageUrl, // Include the image URL
            });
            navigate("/admin");  // Navigate back to products page after update
        } catch (err) {
            console.log("Error updating product:", err);
        }
    };

    return (
        <div className="form-container">
            <h1>Update Product</h1>
            <form>
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    value={product.title}
                    onChange={handleChange}
                    placeholder="Enter product title"
                />
                
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                />

                <label>Price</label>
                <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    placeholder="Enter product price"
                />

<label>Category</label>
                <select
                    name="categoryID"
                    value={product.categoryID}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.categoryID} value={category.categoryID}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <label>Stock</label>
                <input
                    type="number"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                    placeholder="Enter product stock"
                />


                {/* Image input */}
                <label>Upload New Image (Optional)</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                />

                <div className="button-container">
                    <button onClick={handleClick}>Update Product</button>
                    <button
                        type="button"
                        className="cancel"
                        onClick={() => navigate("/admin")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Update;
