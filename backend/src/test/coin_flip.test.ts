import { CoinFlip } from '../logic/coin_flip';
import { User } from '../model/user';

describe('CoinFlip Game', () => {
    let game: CoinFlip;
    const mockUser: User = { id: '123', email: 'test@test.com', username: 'Lila' };

    beforeEach(() => {
        game = new CoinFlip();
        game.bets = new Map();
    });

    test('should allow bets when unlocked', () => {
        game.locked = false;
        game.AddBet(mockUser, true, 100);
        
        const bet = game.bets.get('123');
        expect(bet).toEqual([true, 100]);
    });

    test('should reject bets when locked', () => {
        game.locked = true;
        game.AddBet(mockUser, true, 100);
        
        expect(game.bets.size).toBe(0);
    });

    test('should update amount if user bets multiple times', () => {
        game.locked = false;
        game.AddBet(mockUser, true, 100);
        game.AddBet(mockUser, true, 50);
        
        const bet = game.bets.get('123');
        expect(bet![1]).toBe(150);
    });
});







