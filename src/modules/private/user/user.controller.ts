import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/modules/user/user';
import * as bcrypt from "bcryptjs";


@Controller('user')
export class UserController {

     constructor(private readonly userService: UserService) {

    }

    @Get('FindAll')
    public getUsers(): any {
        return this.userService.getAllUsers();

    }

    @Get('findOne/:id')
    public getUserById(@Param() params:any): any {
        const id = Number(params.id);
        if (!isNaN(id)) {
            return this.userService.getUserById(id);

        } else {
            return new HttpException('Id no valido',
                 HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @Post('newUser')
    public newUser(@Req() request: any): any {
        const objUser: User = request.body as User;

        objUser.password = bcrypt.hashSync(objUser.password, 12);

        return this.userService.createUser(objUser);
    }

    @Put('update')
    public updateUser(@Req() request: any): any {
      const objUpdate: User = request.body as User;
        objUpdate.password = bcrypt.hashSync(objUpdate.password, 12);
      return this.userService.updateUser(objUpdate.id, objUpdate);
    }

    @Put('update/:id')
    public updateUserById(@Param() params:any, @Req() request: any): any {

        const id = Number(params.id)
        const objUpdate: User = request.body;
        if (!isNaN(id)) {
            const objUpdate: User = request.body as User;
            objUpdate.password = bcrypt.hashSync(objUpdate.password, 12);
            return this.userService.updateUser(id, objUpdate);
        }else{
            return new HttpException('Id no valido',409);

        }
    }

    @Delete('delete/:id')

    public deleteUser(@Param() params: any): any {
        const id = Number(params.id);
        if (!isNaN(id)) {
            return this.userService.deleteUser(id);
        } else {
            return new HttpException('Id no valido', HttpStatus.NOT_ACCEPTABLE);
        }
    }
}
