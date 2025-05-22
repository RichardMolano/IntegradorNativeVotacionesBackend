import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Candidates } from 'src/modules/candidates/candidates';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CandidatesService {

    
        private candidateRepositorio: Repository<Candidates>;
    
        constructor(poolConexion: DataSource) {
            this.candidateRepositorio = poolConexion.getRepository(Candidates);
        }
    
        public async getCandidates(): Promise<any> {
            return this.candidateRepositorio.find();
        }

        public async getCandidateById(id: number): Promise<any> {
            return this.candidateRepositorio.findBy({ id: id });
        }

        public async newCandidate(objCandidate: Candidates):Promise<any> {

            return this.candidateRepositorio.save(objCandidate).then((response) => {
               return response;
            }).catch((error) => {
               return new HttpException('Error al crear candidato', HttpStatus.BAD_REQUEST);
            })
        }

        public async updateCandidate(cod: number, objUpdate: Candidates):Promise<any>{
            return this.candidateRepositorio.update({id: cod}, objUpdate).then((response) => {

                return new HttpException(JSON.stringify({
                    "Actualizar": response,
                    "Actualizado": objUpdate
                }), HttpStatus.OK);
    
            }).catch((error) => {
                return new HttpException('Error al actualizar rol', HttpStatus.BAD_REQUEST);
            });
        }
    
        public async delete(id: number):Promise<any> {
            return this.candidateRepositorio.delete({id: id}).then((response) => {
                return new HttpException('Candidato eliminado', HttpStatus.OK);
            }).catch((error) => {
                return new HttpException('Error al eliminar candidato', HttpStatus.BAD_REQUEST);
            });
        }
}
