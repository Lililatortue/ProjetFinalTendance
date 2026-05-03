import { Collection, MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

import { ResponseError } from '../model/exception'
import { User, UserDoc } from '../model/user'

const debug = require('debug')('app:log');


export class Auth {
      private users: Collection<UserDoc>;
      
      constructor(dbClient: MongoClient) {
            this.users = dbClient.db('auth_db').collection<UserDoc>('users');
            this.users.createIndex({ email: 1 }, { unique: true })
                  .catch(err => console.error("Index creation failed:", err));
      }

      public async add(email: string, username: string, password: string) {
            debug("[AUTH][ADD] sanitizing") 
            const cleanEmail = email.trim().toLowerCase()
            const cleanUname = username.trim()
            const cleanPsw   = password.trim()

            //sanitize
            if(!cleanEmail || cleanEmail.length < 1){
                  throw new AuthBadRequestError("email can't be empty")
            }
            
            if(!cleanUname || cleanUname.length < 1){
                  throw new AuthBadRequestError("username can't be empty") 
            }

            if(!cleanPsw || cleanPsw.length < 1){ 
                  throw new AuthBadRequestError("password can't be empty")
            }

            debug("[AUTH][ADD] hashing password") 
            //encrypt
            let hash = await bcrypt.hash(cleanPsw, 10)   

            debug("[AUTH][ADD] adding a user to db") 
            await this.users.insertOne({
                  email: cleanEmail,
                  username: cleanUname,
                  amount  : 0,
                  password: hash
            }); 
      }

      public async verify(email: string, password: string): Promise<User> {
            debug("[AUTH][ADD] verifying user to db") 

            const user = await this.users.findOne({ email });

            if (!user) {
                  throw new AuthInvalidCredentialsError("invalid credentials");
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                  debug("[AUTH][VERIFY] Password mismatch for: %o", email);
                  throw new AuthInvalidCredentialsError("invalid credentials");
            }

            return { id: user._id.toString(), email: user.email, username: user.username };
      }
}

// ERROR HANDLING


export class AuthBadRequestError extends ResponseError {
    constructor(message: string = "Bad Request") {
        super(message, 400);
        this.name = "AuthBadRequestError";
    }
}

export class AuthInvalidCredentialsError extends ResponseError {
    constructor(message: string = "Invalid email or password") {
        super(message, 401);
        this.name = "AuthInvalidCredentialsError";
    }
}
