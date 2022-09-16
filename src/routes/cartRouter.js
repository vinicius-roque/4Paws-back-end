import express from 'express';
import { fetchCart, removeFromCart, addToCart } from '../controllers/cartController.js';
import userAuthentication from '../middlewares/authenticationMiddleware.js';

const cartRouter = express.Router();

cartRouter.get('/cart', fetchCart);
cartRouter.post('/cart', addToCart);
cartRouter.delete('/cart', removeFromCart);

export default cartRouter;
