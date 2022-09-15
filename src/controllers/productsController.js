import db from '../database/db.js';

async function fetchProducts (req, res) {

    try {
        const products = await db.collection('products').find().toArray();
        return res.send(products).status(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export { fetchProducts };
