import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from 'src/modules/role/role';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RolService {

    private rolRepositorio: Repository<Role>;

    constructor(poolConexion: DataSource) {
        this.rolRepositorio = poolConexion.getRepository(Role);
    }

    public async getRoles(): Promise<any> {
        return this.rolRepositorio.find();
    }

    public async getRoleById(id: number): Promise<any> {
        return this.rolRepositorio.findBy({ id: id });
    }

    public async newRole(objRole: Role):Promise<any> {

        return this.rolRepositorio.save(objRole).then((response) => {
           return response;
        }).catch((error) => {
           return new HttpException('Error al crear rol', HttpStatus.BAD_REQUEST, error);
        })
    }

    public async updateRole(cod: number, objUpdate: Role):Promise<any>{
        return this.rolRepositorio.update({id: cod}, objUpdate).then((response) => {

            return new HttpException(JSON.stringify({
                "Actualizar": response,
                "Actualizado": objUpdate
            }), HttpStatus.OK);

        }).catch((error) => {
            return new HttpException('Error al actualizar rol', HttpStatus.BAD_REQUEST);
        });
    }

    public async delete(id: number):Promise<any> {
        return this.rolRepositorio.delete({id: id}).then((response) => {
            return new HttpException('Rol eliminado', HttpStatus.OK);
        }).catch((error) => {
            return new HttpException('Error al eliminar rol', HttpStatus.BAD_REQUEST);
        });
    }
}
