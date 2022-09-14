
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);

mongoClient.connect(() => {
  global.db = mongoClient.db("mywallet");
});

// basic example functions

app.post("/cadastro", signUp);
app.post("/login", login);

app.listen(process.env.PORT, () => {
  console.log("Server is listening on port " + process.env.PORT);
});


// Chame essa função como middleware para verificar o token do usuário

async function verificaToken(req, res, next) {
  const authorization = req.headers.authorization;

  const token = authorization?.replace("Bearer ", "");

	if (!token) {
    return res.sendStatus(401);
	}

  const session = await db.collection("sessions").findOne({ token });
  if (!session) {
    return res.sendStatus(401);
  }

	const user = await db.collection("users").findOne({ 
		_id: session.userid 
	});
    
	if (!user) {
	  return res.sendStatus(401);
	}

	res.locals.user = session;
    res.locals.body = req.body;

  next();
}