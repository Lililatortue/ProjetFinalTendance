import express from 'express';
import cors from 'cors';
import { Server } from "socket.io";
import { createRoutes } from './routes';


import { createServer } from 'http';
import { MongoClient } from 'mongodb';
import { UserStore } from './logic/user';
import { CoinFlip } from './logic/coin_flip';
import { Jwt } from './logic/jwt';
declare module "socket.io" {
  interface Socket {
    userId: string;
  }
}

const debug = require('debug')('app:log');
const client = new MongoClient("mongodb+srv://willdescoteaux_db_user:Q7Jw5YgKg0ZhwIbH@cluster0.vmmqwiy.mongodb.net/?appName=Cluster0")


const app = express()
app.use(cors())
app.use(express.json());
app.use("/", createRoutes(client));

const httpServer = createServer(app);



//making the game work
const io = new Server(httpServer, {
      cors: {
            origin: "*"
      }
});

let game = new CoinFlip();

io.on("connection", (socket) => {
      //verification
      const tokenStr = socket.handshake.headers.authorization;

      if (!tokenStr) {
            debug("Connection rejected: No token provided");
            socket.emit("error-token")
            return socket.disconnect();
      }

      try {
            const decoded = Jwt.Decode(tokenStr);
            socket.userId = decoded.userId;
            debug(`User ${socket.userId} connected`);
      } catch (error) {
            debug(`Connection rejected: ${error}`);
            socket.emit("error-token")
            setTimeout(() => {
                  socket.disconnect(true);
            }, 100);
            return; 
      }

      //makes bets
      socket.on("placeBet", (data) => {
            if (game.state !== 'betting') {
                  return socket.emit("error-betting", "BETS ARE CLOSED");
            }
            try{
                  game.AddBet(socket.userId, data.side, data.amount);
                  debug(`Bet locked: ${socket.userId} on ${data.side}`);
                  socket.emit("betConfirmed");
            }
            catch {
                  io.emit("error-betting",)
            }
      });

      // send messages in chat
      socket.on("sendMessage", (message: string) => {
            if (!message || message.trim().length === 0) return;

            const chatPayload = {
                  userId: socket.userId,
                  text: message.trim(),
                  timestamp: new Date().toISOString()
            };

            io.emit("newMessage", chatPayload);
      });
});

let store = new UserStore(client);
let timeLeft = 0;
let timerInterval: NodeJS.Timeout | null = null;

function loop(){
      game.state = "betting"
      io.emit("state", game.state)

      timeLeft = 40;
      timerInterval = setInterval(() => {
            timeLeft--;
            io.emit('timerUpdate', { timeLeft });

            if (timeLeft <= 0) {
                  if (timerInterval) clearInterval(timerInterval);
                  timerInterval = null;
            }
      }, 1000);


      //start game
      game.startBets(40, ()=>{ 
            io.emit("state", game.state)
            let result = game.headsOrTails();

            io.emit("ShowResult", result)

            let winners = game.winner(result);
            for (const [id, amount] of winners){ 
                  store.AddMoney(id, amount * 2)
            } 

            setTimeout(loop,10000)
      });
}
async function startServer() {
    try {
        await client.connect(); 
        console.log("Connected to MongoDB");

        httpServer.listen(3000, () => {
            console.log("Server listening on port 3000");
            loop(); 
        });
    } catch (err) {
        console.error("Failed to connect to DB:", err);
        process.exit(1);
    }
}
startServer();

