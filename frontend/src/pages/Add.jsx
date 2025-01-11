import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./addstyle.css"

const Add = () => {
    const [product, setProduct] = useState({
        title: "",
        description: "",
        price: "",
        images: "",
        categoryID: "",
        stocl: "",
    });
    const [file, setFile] = useState(null);
    const [categories, setCategories] = useState([]); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:8800/categories");
                setCategories(res.data);  // Set the categories fetched from the backend
            } catch (err) {
                console.log("Error fetching categories:", err);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleClick = async (e) => {
        e.preventDefault();

        let imageUrl = product.images;

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
            // Send the image URL and other product details
            await axios.post("http://localhost:8800/products", {
                ...product,
                images: imageUrl, // If image is unchanged, it will just use the previous URL
            });
            navigate("/admin");  // Navigate to products page after adding
        } catch (err) {
            console.log("Error adding product:", err);
        }
    };

    return (
        <div className="form-container">
            <h1>Add Product</h1>
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

                <label>Upload Image</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                />
                
                <div className="button-container">
                    <button onClick={handleClick}>Add Product</button>
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

export default Add;
