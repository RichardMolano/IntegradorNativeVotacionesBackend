import { NestMiddleware, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class Security implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: 'Peticion negada por el sistema de seguridad',
      });
    } else {
        try{

            let token = req.headers.authorization.split(' ')[1] as string;
            let datoSesion = verify(token, String(process.env.SECRET_PASSWORD));
            if(req.method != "PUT"){
                req.method != 'POST' ? req.body = datoSesion : req.body
            }

            next();

        }catch(error){
            res.status(401).json({
                message: 'Good try buddy',
                error: error
            })
        }
    }
  }
}
