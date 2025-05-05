
import { db } from "../config/database.js";

export const getProducts = async (req, res) => {
    try {
        const products = await db`SELECT * FROM products ORDER BY created_at DESC`;
        res.status(200).json({
            status: 'success',
            data: products,
            message: 'Products retrieved successfully!'
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await db`SELECT * FROM products WHERE id = ${id}`;
        if (product.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({
            status: 'success',
            data: product[0],
            message: 'Product retrieved successfully!'
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        if (!name || !description || !price) {
            return res.status(400).json({ error: 'Name, description, and price are required' });
        }
        const newProduct = await db`INSERT INTO products (name, description, price) VALUES (${name}, ${description}, ${price}) RETURNING *`;
        res.status(201).json({
            status: 'success',
            data: newProduct[0],
            message: 'Product created successfully!'
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal server error' });
        
    }
}
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        if (!name && !description && !price) {
            return res.status(400).json({ error: 'At least one field (name, description, price) is required' });
        }
        const newProduct = await db `UPDATE products SET name = COALESCE(${name}, name), description = COALESCE(${description}, description), price = COALESCE(${price}, price) WHERE id = ${id} RETURNING *`;
        if (newProduct.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({
            status: 'success',
            data: newProduct[0],
            message: 'Product updated successfully!'
        });	
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
        
    }
}
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await db`DELETE FROM products WHERE id = ${id} RETURNING *`;
        if (deletedProduct.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({
            status: 'success',
            data: deletedProduct[0],
            message: 'Product deleted successfully!'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
        
    }
}
