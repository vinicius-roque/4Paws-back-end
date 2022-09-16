import db from '../database/db.js';
import { ObjectId } from "mongodb";

async function addToCart (req, res) {
    const { id } = req.body
    try {
        const product = await db.collection('products').findOne({ _id: new ObjectId(id) })
        console.log(id, product)
        if (!product) {
            return res.sendStatus(404);
        }
        const addToCart = await db.collection('cart').insertOne({ name: product.name, price: product.price, img: product.img, type: product.type});

        return res.send(addToCart).status(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function fetchCart (req, res) {
    try {
        const products = await db.collection('cart').find().toArray();
        console.log(products);
        return res.send(products).status(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function removeFromCart (req, res) {
    const { id } = req.params
    try {
        const product = await db.collection('cart').findOne({ _id: new ObjectId(id) })
        if (!product) {
            return res.sendStatus(404);
        }
        const removeFromCart = await db.collection('cart').deleteOne({ _id: new ObjectId(id) });

        return res.send(removeFromCart).status(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export { addToCart, removeFromCart, fetchCart};

