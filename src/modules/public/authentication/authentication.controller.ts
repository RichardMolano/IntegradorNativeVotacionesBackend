import { Controller, Post, Req } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { User } from 'src/modules/user/user';

@Controller('auth')
export class AuthenticationController {

    constructor(private readonly authenticationService: AuthenticationService) {

     }

    @Post('/signin')
    private iniciarSesion(@Req() req:any){
        const objUsuario: User = req.body;
        return this.authenticationService.inicioSesion(objUsuario);
    }
}
