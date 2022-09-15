import joi from 'joi';
import bcrypt from 'bcrypt';
import { stripHtml } from 'string-strip-html';
import db from '../database/db.js';

const signUpSchema = joi.object({ 
    _id: joi.string().length(24).hex(),
    name: joi.string().min(1).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    passwordConfirmation: joi.string().valid(joi.ref('password')).required()
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

export { signUp };
