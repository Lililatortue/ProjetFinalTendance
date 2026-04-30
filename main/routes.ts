import { Router } from 'express';
import { Auth } from './logic/auth';
import { Jwt } from './logic/jwt';
import { ResponseError } from './model/exception';

export const createRoutes = (client: any) => {
    const router = Router();
    const debug = require('debug')('app:routes');

      router.post("/signup", async (req, res)=> {
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

      router.post("/login", async (req, res)=>{
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
      router.get("/account", (req, res)=>{
            debug("[ACCOUNT][ROUTE]")
            Jwt.Decode(req.body.user);
      

      });
      router.get("/account/money", (req, res)=> { 
            debug("[ACCOUNT][MONEY][ROUTE]")
            Jwt.Decode(req.body.user);
      
      });

      router.get("/stats/", (req, res)=> {
            debug("[STATS][ROUTE]"); 


      });

      return router;
}

