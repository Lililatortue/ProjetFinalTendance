import { User } from '../model/user'
import { ResponseError } from '../model/exception';

const jwt = require('jsonwebtoken');
const debug = require('debug')('app:log');

const SECRET_KEY = "lol_123456789"

export class Jwt {
      static Encode(user: User){
            debug("[LOGIN] encoding user")
            if (!user) { throw new JwtBadArgumentError("no user to encode") }

            const payload = {
                  id: user.id,
                  email: user.email,
                  username: user.username
            };

            return jwt.sign(payload, SECRET_KEY, {
                  expiresIn: '24h'
            });
      }

      static Decode(token: string): any{
            debug("[LOGIN] Decoding token string"); 
            if (!token){ throw new JwtUnAuthorizeError("no token was found"); };

            try {
                  return jwt.verify(token, SECRET_KEY);
            } catch (error) {
                  throw new  JwtUnAuthorizeError("Expired token");
            }
      }
}


// ERROR HANDLING

class JwtBadArgumentError extends ResponseError { 
      constructor(message: string) {
            super(message, 400);
            this.name = "JwtInvalidTokenError";
      }
}

class JwtUnAuthorizeError extends ResponseError { 
      constructor(message: string) {
            super(message, 401);
            this.name = "JwtInvalidTokenError";
      }
}


