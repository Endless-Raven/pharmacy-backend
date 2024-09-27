const db = require("../config/db");

// Get all products
const getProducts = async (req, res) => {
  const sql = "SELECT * FROM products";
  
  try {
    console.log("get products");
    const [rows] = await db.query(sql);
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return res.status(500).json({ message: "Error inside server", err });
  }
};

//get by producy ID
const getProductsById = async (req, res) => {
  const productId = req.params.product_id; // Get the product_id from the request parameters

  // SQL query to select product by product ID
  const sql = "SELECT * FROM products WHERE product_id = ?";

  try {
    console.log("Fetching product by ID:", productId);
    
    const [rows] = await db.query(sql, [productId]); // Pass the product ID as a parameter to the query

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found." }); // Handle case where no product is found
    }

    return res.json(rows[0]); // Return the found product
  } catch (err) {
    console.error("Error fetching product:", err.message);
    return res.status(500).json({ message: "Error inside server", err });
  }
};


//1st 20
const getProductsTwenty = async (req, res) => {
  // SQL query to select the first 20 products
  const sql = "SELECT * FROM products LIMIT 20";
  
  try {
    console.log("Fetching first 20 products");
    const [rows] = await db.query(sql); // Execute the SQL query
    
    return res.json(rows); // Return the found products
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return res.status(500).json({ message: "Error inside server", err });
  }
};

//by category ID
const getProductsByCategoryId = async (req, res) => {
  const categoryId = req.params.category_id; 

  // SQL query to select products by category ID
  const sql = "SELECT * FROM products WHERE category_id = ?";

  try {
    console.log("Fetching products by category ID:", categoryId);
    
    const [rows] = await db.query(sql, [categoryId]); // Pass the category ID as a parameter

    if (rows.length === 0) {
      return res.status(404).json({ message: "No products found for this category." }); // Handle case where no products are found
    }

    return res.json(rows); // Return the found products
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return res.status(500).json({ message: "Error inside server", err });
  }
};

//by category Name
const getProductsByCategoryName = async (req, res) => {
  const categoryName = req.params.name; // Get the category name from the request parameters

  // SQL query to select products by category name
  const sql = `
    SELECT p.* 
    FROM products p
    INNER JOIN categories c ON p.category_id = c.category_id
    WHERE c.name = ?
  `;

  try {
    console.log("Fetching products by category name:", categoryName);
    
    const [rows] = await db.query(sql, [categoryName]); // Pass the category name as a parameter

    if (rows.length === 0) {
      return res.status(404).json({ message: "No products found for this category." }); // Handle case where no products are found
    }

    return res.json(rows); // Return the found products
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return res.status(500).json({ message: "Error inside server", err });
  }
};

//first 5 by category ID
const getProductsByCategoryIdFive = async (req, res) => {
  const categoryId = req.params.category_id; 

  // SQL query to select the first 5 products by category ID
  const sql = "SELECT * FROM products WHERE category_id = ? LIMIT 5";

  try {
    console.log("Fetching first 5 products by category ID:", categoryId);
    
    const [rows] = await db.query(sql, [categoryId]); // Pass the category ID as a parameter

    if (rows.length === 0) {
      return res.status(404).json({ message: "No products found for this category." }); // Handle case where no products are found
    }

    return res.json(rows); // Return the found products
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return res.status(500).json({ message: "Error inside server", err });
  }
};



//add product
const addProduct = async (req, res) => {

  console.log("Request body:", req.body); // Log the request body

  const sql = `
  INSERT INTO products (name, description, price, stock_quantity, category_id, rating, color)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

const values = [
  // nextId,
  req.body.name,
  req.body.description,
  req.body.price,
  req.body.stock_quantity,
  req.body.category_id,
  req.body.rating,
  req.body.color,
];

  try {
     // Step 1: Generate the next ID
    // const generateNextId = async () => {
    //   const query = "SELECT product_id FROM products";
    //   const [results] = await db.query(query);
      
    //   if (results.length === 0) {
    //     return "P0001";
    //   }

    //   const ids = results.map(product => parseInt(product.product_id.slice(1)));
    //   const maxId = Math.max(...ids);
    //   return `P${(maxId + 1).toString().padStart(4, "0")}`;
    // };

    // const nextId = await generateNextId();

    const [result] = await db.query(sql, values);
    return res.status(200).json({ message: "Product added successfully.", result });
  } catch (err) {
    console.error("Error adding Product:", err.message);
    return res.status(500).json({ message: "Error inside server.", err });
  }
};


// Update a product
const updateProduct = async (req, res) => {
  console.log("Request body:", req.body); // Log the request body

  const sql = `
    UPDATE products 
    SET name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ?, rating = ?, size = ?, color = ?
    WHERE product_id = ?
  `;

  const productId = req.params.product_id; 

  const values = [
    req.body.name,
    req.body.description,
    req.body.price,
    req.body.stock_quantity,
    req.body.category_id,
    req.body.rating,
    req.body.size,
    req.body.color,
    productId, 
  ];

  try {
    const [result] = await db.query(sql, values); 
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found." }); 
    }
    return res.status(200).json({ message: "Product updated successfully.", result });
  } catch (err) {
    console.error("Error updating Product:", err.message); // Log any error messages
    return res.status(500).json({ message: "Error inside server.", err });
  }
};



// Delete a product
const deleteProduct = async (req, res) => {
  const sql = "DELETE FROM products WHERE product_id = ?;";
  const value = req.params.product_id;

  try {
    console.log("delete product");
    const [result] = await db.query(sql, [value]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Message: "Product not found" });
    }
    return res.json({ Message: "Product deleted successfully", result });
  } catch (err) {
    return res.status(500).json({ Message: "Error inside server", err });
  }
};

module.exports = {
  getProducts,
  getProductsById,
  getProductsByCategoryId,
  getProductsByCategoryName,
  getProductsTwenty,
  getProductsByCategoryIdFive,
  addProduct,
  updateProduct,
  deleteProduct
};
