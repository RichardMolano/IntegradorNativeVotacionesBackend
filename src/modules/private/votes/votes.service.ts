import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Votes } from 'src/modules/votes/votes';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class VotesService {

       private votesRepositorio: Repository<Votes>;

        constructor(poolConexion: DataSource) {
            this.votesRepositorio = poolConexion.getRepository(Votes);
        }

        public async getVotes(): Promise<any> {
            return this.votesRepositorio.find();
        }

        public async getVoteById(id: number): Promise<any> {
            return this.votesRepositorio.findBy({ id: id });
        }

        public async newVote(objVote: Votes):Promise<any> {

            return this.votesRepositorio.save(objVote).then((response) => {
               return response;
            }).catch((error) => {
               return new HttpException('Error al crear voto', HttpStatus.BAD_REQUEST);
            })
        }

        public async updateVote(cod: number, objUpdate: Votes):Promise<any>{
            return this.votesRepositorio.update({id: cod}, objUpdate).then((response) => {

                return new HttpException(JSON.stringify({
                    "Actualizar": response,
                    "Actualizado": objUpdate
                }), HttpStatus.OK);
    
            }).catch((error) => {
                return new HttpException('Error al actualizar voto', HttpStatus.BAD_REQUEST);
            });
        }
    
        public async delete(id: number):Promise<any> {
            return this.votesRepositorio.delete({id: id}).then((response) => {
                return new HttpException('Voto eliminado', HttpStatus.OK);
            }).catch((error) => {
                return new HttpException('Error al eliminar voto', HttpStatus.BAD_REQUEST);
            });
        }
}
