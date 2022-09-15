import './setup.js'
import express from "express";
import cors from "cors";
import authRouter from './routes/authRouter.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use(authRouter);

app.listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}!`));