import express, { request } from 'express';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

const app = express();


app.post("/api/v1/signup", (req, res) => {
    console.log("you are signed up");
});

app.post("/api/v1/signin", (req, res) => {
    
    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        token
    })

});

app.post("/api/v1/room", (req, res) => {
    console.log("room is created");
});


app.listen(3001);