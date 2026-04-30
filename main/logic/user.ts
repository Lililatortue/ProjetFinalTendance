import { Collection, MongoClient, ObjectId } from 'mongodb';
import { ResponseError } from '../model/exception'
import { User, UserDoc } from '../model/user'

const debug = require('debug')('app:log');



export class UserStore {
      private users: Collection<UserDoc>;

      constructor(dbClient: MongoClient) {
            this.users = dbClient.db('auth_db').collection<UserDoc>('users');
      }


      public fetchMoney(id: string, amount: number): Promise<number | null> {
            return this.users.findOne({_id: new ObjectId(id)}).then(u => {
                  if (!u) return null; // Sécurité si l'utilisateur n'existe pas

                  let num: number = 0;

                  if (u.amount < amount) { //all in
                        num = u.amount;
                        u.amount = 0;
                  } else {
                        num = amount;
                        u.amount -= amount;
                  }

                  return this.users.updateOne({_id: u._id},{$set: u}).then(() => num);
            });
      }
      
      public AddMoney(id: string, amount: number) {
           this.users.updateOne(
                 {_id: new ObjectId(id)}, 
                 {$inc: {amount: amount}}
           )
      }
}
