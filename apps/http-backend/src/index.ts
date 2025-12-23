import express, { request } from 'express';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {middleware} from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema} from "@repo/common/types";
import { prismaClient } from "@repo/db/client"

const app = express();
app.use(express.json());


app.post("/signup", async (req, res) => {
    //db call
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.json({
            message: "Incorrect Inputs"
        })
    }
    try {
        await prismaClient.user.create({
        data: {
            email: parsedData.data?.username,
            password: parsedData.data.password,
            name: parsedData.data.name
        }
    })
    res.json({
        userId: 123
    })
    } catch (e) {
        res.status(411).json({
            message: "user already exists with this username"
        })
    }
});

app.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.json({
            message: "Incorrect Inputs"
        })
    }

    //TODO: compare the hashed password here

    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    })

    if(!user) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }
    
    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET);

    res.json({
        token
    })

});

app.post("/room", middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.json({
            message: "Incorrect Inputs"
        })
    }
    const userId = req.userId;

    if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

    try {
        const room = await prismaClient.room.create({
        data: {
            slug: parsedData.data.name,
            adminId: userId
            }
        })

        res.json({
            roomId: room.id
        })
    } catch (e) {
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }
});


app.listen(3001);