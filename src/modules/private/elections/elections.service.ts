import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import e from 'express';
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

        public async getElectionsForVotant(id_user : number): Promise<any> {
            return this.electionsRepositorio.find({ where: { votesElections: { id_user: id_user }}});
        }
        public async getElectionsForCandidate(id_user : number): Promise<any> {
            return this.electionsRepositorio.find({ where: { candidatesElections: { id_user: id_user }}});
        }

        public async newElection(objElection: Elections):Promise<any> {
            const nowDate = new Date();
            objElection.codeJoin = Math.random().toString(36).substring(2, 10);
            if (objElection.start_date < nowDate && objElection.end_date < nowDate) {
                objElection.state = true; // if is in range of dates, set state to true
            }

            return this.electionsRepositorio.save(objElection).then((response) => {
                if (!response) {
                    throw new HttpException('Error al crear elección', HttpStatus.BAD_REQUEST);
                }

                response.codeJoin = objElection.codeJoin; // Ensure the codeJoin is included in the response
                response.start_date = objElection.start_date;
                response.end_date = objElection.end_date;
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

        public async getElectionResults(id_user: number): Promise<any> {
            console.log('Obteniendo resultados de elecciones para el usuario:', id_user);
            return this.electionsRepositorio.find({
                where: [
                    { candidatesElections: { id_user: id_user }},
                    { votesElections: { id_user: id_user }}
                ],
                relations: ['candidatesElections' ,'candidatesElections.userStudent.userStudent','votesElections'],
            }).then((elections) => {
                return elections.map((election) => {
                    const { candidatesElections, votesElections, ...electionData  } = election;
                    return {
                        ...electionData,
                        candidates: candidatesElections.map(candidate => ({
                            id: candidate.id,
                            id_user: candidate.userStudent
                        })),
                        votes: votesElections.map(vote => ({
                            id_user: vote.id_user,
                            id_candidate: vote.id_candidate
                        }))

             
                    };
                });
            }).catch((error) => {
                error.message = 'Error al obtener resultados de elecciones: ' + error.message;
                throw new HttpException('Error al obtener resultados de elecciones', HttpStatus.BAD_REQUEST);
            });
        }

}
