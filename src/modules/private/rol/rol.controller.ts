import { Role } from 'src/modules/role/role';
import { RolService } from './rol.service';
import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';

@Controller('rol')
export class RolController {

     constructor(private readonly rolService: RolService) {

    }

    @Get('FindAll')
    public getRoles(): any {
        return this.rolService.getRoles()   ;
    }

    @Get('findOne/:id')
    public getRoleById(@Param() params:any): any {
        const id = Number(params.id);
        if (!isNaN(id)) {
            return this.rolService.getRoleById(id);

        } else {
            return new HttpException('Id no valido',
                 HttpStatus.NOT_ACCEPTABLE);
            
        }
    }

    @Post('newRole')
    public newRole(@Req() request: any): any {
        const objRole: Role = request.body as Role;
        return this.rolService.newRole(objRole);
    }

    @Put('update')
    public updateRole(@Req() request: any): any {
      const objUpdate: Role = request.body as Role;
      return this.rolService.updateRole(objUpdate.id, objUpdate);
    }

    @Put('update/:id')
    public updateRoleById(@Param() params:any, @Req() request: any): any {
    
        const id = Number(params.id)
        const objUpdate: Role = request.body;
        if (!isNaN(id)) {
            const objUpdate: Role = request.body as Role;
            return this.rolService.updateRole(id, objUpdate);
        }else{
            return new HttpException('Id no valido',409);

        }
    }

    @Delete('delete/:id')

    public deleteRole(@Param() params: any): any {
        const id = Number(params.id);
        if (!isNaN(id)) {
            return this.rolService.delete(id);
        } else {
            return new HttpException('Id no valido', HttpStatus.NOT_ACCEPTABLE);
        }
    }
}
