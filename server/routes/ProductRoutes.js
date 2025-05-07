
import express from 'express';

import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/ProductController.js';

const ProductsRouter = express.Router();

ProductsRouter.get('/', getProducts);
ProductsRouter.get('/:id', getProductById);
ProductsRouter.post('/', createProduct);
ProductsRouter.put('/:id', updateProduct);
ProductsRouter.delete('/:id', deleteProduct);

export default ProductsRouter;