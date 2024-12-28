import React, { useState, useEffect } from "react";
import axios from "axios";

const Search = () => {
    const [products, setProducts] = useState([]); // State to hold all products
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products

    // Fetch all products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:8800/products");
                setProducts(res.data);
                setFilteredProducts(res.data); // Initialize filtered products
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        fetchProducts();
    }, []);

    // Handle search input changes
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search
        setSearchQuery(query);

        // Filter products based on the search query
        const filtered = products.filter((product) =>
            product.title.toLowerCase().includes(query)
        );
        setFilteredProducts(filtered);
    };

    return (
        <div className="search-page">
            <h1>Search Products</h1>
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={handleSearch}
                style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "20px",
                    fontSize: "16px",
                }}
            />
            {/* Display filtered products */}
            <div className="product-list">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.productID} className="product-card">
                            <img
                                src={`http://localhost:8800${product.images}`}
                                alt={product.title}
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />
                            <h3>{product.title}</h3>
                            <p>{product.description}</p>
                            <span>₱{product.price}</span>
                        </div>
                    ))
                ) : (
                    <p>No products found matching your search.</p>
                )}
            </div>
        </div>
    );
};

export default Search;
