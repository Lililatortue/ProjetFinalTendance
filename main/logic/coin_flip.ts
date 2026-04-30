import { User } from '../model/user'
const debug = require('debug')('app:log');

export class CoinFlip {
      state: "betting" | "result" = "betting"
      bets: Map<string, [boolean, number]> = new Map();
      timer: NodeJS.Timeout | null = null;
      

      // Add 'side' parameter (true = heads, false = tails)
      public AddBet(id: string, side: boolean, amount: number) {
            if (this.state != "betting") return;

            const existing = this.bets.get(id);
        
            if (existing) {
                  const newAmount = existing[1] + amount;
                  this.bets.set(id, [side, newAmount]);
            } else {
                  this.bets.set(id, [side, amount]);
            }

            debug(`[COINFLIP] ${id} bet ${amount} on ${side ? 'Heads' : 'Tails'}`);
      }
      
      public headsOrTails(): boolean {
            return Math.random() < 0.5
      }

      public winner(result: boolean): [string, number][] {
            const winners: [string, number][] = [];

            for (const [userId, [side, amount]] of this.bets) {
                  if (side === result) {
                        winners.push([userId, amount * 2]);
                  }
            }
            return winners;
      }

      public startBets(seconds: number, callback: () => void) {
            if (this.timer || this.state != "betting") return;
            debug("[COINFLIP] timer as started");

            this.timer = setTimeout(() => {
                  this.state  = "result"
                  callback();
                  this.timer = null;
            }, seconds * 1000);
      }

}




