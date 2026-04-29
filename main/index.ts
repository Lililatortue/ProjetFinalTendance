import express from 'express';
import { createServer } from 'http';
import { MongoClient } from 'mongodb';
import { Auth } from './logic/auth';
import { Jwt }  from './logic/jwt';
import { ResponseError } from './model/exception';
import { Server } from "socket.io";

const debug = require('debug')('app:log');
const app = express()
const client = new MongoClient("mongodb+srv://willdescoteaux_db_user:wyGxwDIsDo6wuOKP@cluster0.vmmqwiy.mongodb.net/?appName=Cluster0")


//making the game work
const httpServer = createServer(app);
const io = new Server(httpServer, {
      cors: {
            origin: "*"
      }
});
httpServer.listen("3000",()=>{})
io.on("FlipTheCoin",(socket)=>{


})




//routes

//"mongodb+srv://willdescoteaux_db_user:wyGxwDIsDo6wuOKP@cluster0.vmmqwiy.mongodb.net/?appName=Cluster0"
//auth
app.post("/signup", async (req, res)=> {
      debug("[SIGNUP][ROUTE]")
      try{
            const { email, uname, psw } = req.body
            let auth  = new Auth(client);

            await auth.add(email, uname, psw)

            res.json({success: true})
      }
      catch(error) {
            debug("[ERROR][SIGNUP] Error: %0", error)

            if (error instanceof ResponseError) {
                  return res.status(error.code || 500)
                            .json({success: false, message: error.message || "internal server error"}) 
            }

            debug("[ERROR][SIGNUP] not a ResponseError class error: %0", error)
            res.status(500).json({success: false, message: "internal server error"});
 
     }      
});

app.post("/login", async (req, res)=>{
      debug("[LOGIN][ROUTE]"); 
      try{
            const { email, psw } = req.body
            let auth  = new Auth(client)

            let user = await auth.verify(email, psw)

            let token= Jwt.Encode(user) 

            res.json({success: true, token: token})
      }
      catch(error) {
            debug("[ERROR][LOGIN] Error: %0", error)

            if (error instanceof ResponseError) {
                  return res.status(error.code || 500)
                            .json({success: false, message: error.message || "internal server error"}) 
            }

            debug("[ERROR][LOGIN] not a ResponseError class error: %0", error)
            res.status(500).json({success: false, message: "internal server error"});
      }
});

//account
app.get("/account", (req, res)=>{
      debug("[ACCOUNT][ROUTE]")
      Jwt.Decode(req.body.user);
      

});
app.get("/account/money", (req, res)=> { 
      debug("[ACCOUNT][MONEY][ROUTE]")
      Jwt.Decode(req.body.user);
      
});

//chat
app.post("/chat/", (req, res)=>{
      debug("[CHAT][ROUTE]"); 

});
//bet
app.post("/bet/", (req, res)=>{
      debug("[BET][ROUTE]"); 
      
});

app.get("/stats/", (req, res)=> {
      debug("[STATS][ROUTE]"); 


});
