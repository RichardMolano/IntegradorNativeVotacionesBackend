import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Elections } from 'src/modules/elections/elections';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ElectionsService {

      private electionsRepositorio: Repository<Elections>;
    
        constructor(poolConexion: DataSource) {
            this.electionsRepositorio = poolConexion.getRepository(Elections);
        }

        public async getElections(): Promise<any> {
            return this.electionsRepositorio.find();
        }

        public async getElectionById(id: number): Promise<any> {
            return this.electionsRepositorio.findBy({ id: id });
        }

        public async newElection(objElection: Elections):Promise<any> {

            return this.electionsRepositorio.save(objElection).then((response) => {
               return response;
            }).catch((error) => {
               return new HttpException('Error al crear elección', HttpStatus.BAD_REQUEST);
            })
        }

        public async updateElection(cod: number, objUpdate: Elections):Promise<any>{
            return this.electionsRepositorio.update({id: cod}, objUpdate).then((response) => {

                return new HttpException(JSON.stringify({
                    "Actualizar": response,
                    "Actualizado": objUpdate
                }), HttpStatus.OK);
    
            }).catch((error) => {
                return new HttpException('Error al actualizar elección', HttpStatus.BAD_REQUEST);
            });
        }
    
        public async delete(id: number):Promise<any> {
            return this.electionsRepositorio.delete({id: id}).then((response) => {
                return new HttpException('Elección eliminada', HttpStatus.OK);
            }).catch((error) => {
                return new HttpException('Error al eliminar elección', HttpStatus.BAD_REQUEST);
            });
        }
}
