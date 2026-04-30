import express from 'express';
import { createServer } from 'http';
import { MongoClient } from 'mongodb';
import { UserStore } from './logic/user';
import { CoinFlip } from './logic/coin_flip';
import { createRoutes } from './routes';
import { Server } from "socket.io";
declare module "socket.io" {
  interface Socket {
    userId: string;
  }
}

const client = new MongoClient("mongodb+srv://willdescoteaux_db_user:Q7Jw5YgKg0ZhwIbH@cluster0.vmmqwiy.mongodb.net/?appName=Cluster0")


const app = express()
app.use(express.json());
app.use("/", createRoutes(client));

const httpServer = createServer(app);



//making the game work
const io = new Server(httpServer, {
      cors: {
            origin: "*"
      }
});

let game = new CoinFlip()
io.on("connection",(socket)=>{

      const userId: string = socket.handshake.auth.userId;
      socket.userId = userId;

      socket.on("sendMessage", (message: string) => {
            if (!message || message.trim().length === 0) return;

            const chatPayload = {
                  userId: socket.userId,
                  text: message.trim(),
                  timestamp: new Date().toISOString()
            };

            io.emit("newMessage", chatPayload);
      });



      socket.on("placeBet", (data) => { 
        if (game.state !== 'betting') {
            return socket.emit("error", "BETS ARE CLOSED");
        }

        game.AddBet(socket.userId,data.side,data.amount);

        console.log(`Bet locked: ${socket.id} on ${data.side}`);
        
        socket.emit("betConfirmed");
    });
})

let store = new UserStore(client);
function loop(){
      game.state = "betting"
      //start game
      game.startBets(60, ()=>{ 
            let result = game.headsOrTails();

            io.emit("ShowResult", result)

            let winners = game.winner(result);
            for (const [id, amount] of winners){ 
                  store.AddMoney(id, amount * 2)
            } 

            setTimeout(loop,20)
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


