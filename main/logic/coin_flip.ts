import { User } from '../model/user'
const debug = require('debug')('app:log');

export class CoinFlip {
    bets: Map<string, [boolean, number]> = new Map();
    timer: NodeJS.Timeout | null = null;
    locked: boolean = true;

    // Add 'side' parameter (true = heads, false = tails)
    public AddBet(user: User, side: boolean, amount: number) {
        if (this.locked) return;

        const existing = this.bets.get(user.id);
        
        if (existing) {
            const newAmount = existing[1] + amount;
            this.bets.set(user.id, [side, newAmount]);
        } else {
            this.bets.set(user.id, [side, amount]);
        }

        debug(`[COINFLIP] ${user.username} bet ${amount} on ${side ? 'Heads' : 'Tails'}`);
    }

    public startTimer(seconds: number, callback: () => void) {
        if (this.timer) return;
        debug("[COINFLIP] timer as started");
        this.locked = false;

        this.timer = setTimeout(() => {
            this.locked = true;
            callback();
            this.timer = null;
        }, seconds * 1000);
    }
}




