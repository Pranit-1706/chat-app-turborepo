import express from "express";
import jwt from "jsonwebtoken";
import { jwt_scret } from "backend-common/config";
import { middleware } from "./middleware";
import {createUserSchema, signinSchema, createRoomSchema} from "common/types"
import {prismaClient} from "db/client"

const app = express();
app.use(express.json());

app.post("/signup",async (req, res)=>{
    const parsedData = createUserSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.json({
            message:"incorrect inputs",
        })
    }

    try{
        const user = await prismaClient.user.create({
            data:{
                email:parsedData.data.username,
                password:parsedData.data.password,
                name:parsedData.data.name
            }
        })

        res.json({
            userId: user.id
        })
    }catch(e){
        res.status(411).json({
            message:"email already exists"
        })
    }
})

app.post("/signin",async (req, res)=>{

    const data = signinSchema.safeParse(req.body);
    if(!data.success){
        return res.json({
            message:"incorrect inputs",
        })
    }

    const user = await prismaClient.user.findFirst({
        where:{
            email:data.data.username,
            password:data.data.password
        }
    })

    if(!user){
        return res.status(400).json({
            message:"no signin"
        })
    }

    const token = jwt.sign({
        userId: user.id
    }, jwt_scret)

    res.json({
        token
    })
})

app.post("/room",middleware, async (req, res)=>{

    const data = createRoomSchema.safeParse(req.body);
    if(!data.success){
        return res.json({
            message:"incorrect inputs",
        })
    }
    //@ts-ignore
    const userId = req.userId;

    try{
        const room = await prismaClient.room.create({
            data:{
                slug: data.data.name,
                adminId: userId
            }
        })

        return res.json({
            roomId: room.id
        })
    }catch(e){
        return res.status(411).json({
            message: "room with this name exists"
        })
    }
})

app.get("/chats/:roomId", async (req, res)=>{
    const roomId = Number(req.params.roomId);   
    const message = await prismaClient.chat.findMany({
        where:{
            roomId:roomId,
        },
        orderBy:{
            id:"desc"
        },
        take:50
    })

    res.json({
        message
    })
})

app.listen(3001);