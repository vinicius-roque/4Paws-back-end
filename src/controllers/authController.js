import joi from 'joi';
import bcrypt from 'bcrypt';
import { stripHtml } from 'string-strip-html';
import db from '../database/db.js';
import { v4 as uuid } from "uuid";

const signUpSchema = joi.object({ 
    _id: joi.string().length(24).hex(),
    name: joi.string().min(1).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    passwordConfirmation: joi.string().valid(joi.ref('password')).required()
});

const signInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(1).required(),
});

async function signUp (req, res) {
    const validation =  signUpSchema.validate(req.body, { abortEarly: false });

    if(validation.error) {
        const errors = validation.error.details.map(error => error.message);

        return res.status(422).send(errors);
    }

    const { email, password } = req.body;
    const name = stripHtml(req.body.name).result.trim();

    if(await analiseUser(email)) {
        return res.sendStatus(409);
    }

    try {
        await db.collection('users').insertOne({
            name,
            email,
            password: bcrypt.hashSync(password, 10)
        });

        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function analiseUser(email) {
    let answer;

    try {
        const existingUser = await db.collection('users').findOne({ email });

        if(existingUser !== null) {
            answer = true;
        } else {
            answer = false;
        }
    } catch (error) {
        console.log(error.message);
        answer = error.message;
    }
    return answer;
}

async function signIn(req, res) {
    const validation = signInSchema.validate(req.body, { abortEarly: false });

    if(validation.error) {
        const errors = validation.error.details.map(error => error.message);

        return res.status(422).send(errors);
    }

    const { email, password } = req.body;

    try {
        const user = await db.collection('users').findOne({ email });

        if(user && bcrypt.compareSync(password, user.password)) {
            const token = uuid();
            await db.collection('sessions').insertOne({
                userId: user._id,
                token
            });
            
            return res.send({ token, name: user.name });
        } else {
            return res.sendStatus(404);
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export { signUp, signIn };
