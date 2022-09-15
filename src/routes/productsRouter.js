import express from 'express';
import { fetchProducts } from '../controllers/productsController.js';

const productsRouter = express.Router();

productsRouter.get('/products', fetchProducts);

export default productsRouter;
