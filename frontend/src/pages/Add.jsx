import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
    const [product, setProduct] = useState({
        title: "",
        description: "",
        price: "",
        images: "",
        category: "",
    });
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            let imagesUrl = "";
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                const uploadRes = await axios.post("http://localhost:8800/upload", formData);
                imagesUrl = uploadRes.data.filePath;
            }
            await axios.post("http://localhost:8800/products", {
                ...product,
                images: imagesUrl,
            });
            navigate("/");  // Navigate to products page after adding
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
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    <option value="Face products">Face products</option>
                    <option value="Eye products">Eye products</option>
                    <option value="Lip products">Lip products</option>
                    <option value="Nail products">Nail products</option>
                    <option value="Skincare essentials">Skincare essentials</option>
                    <option value="Tools and Accessories">Tools and accessories</option>
                    <option value="Body products">Body products</option>
                    <option value="Hair products">Hair products</option>
                    <option value="Fragrances">Fragrances</option>
                </select>

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
                        onClick={() => navigate("/")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Add;
