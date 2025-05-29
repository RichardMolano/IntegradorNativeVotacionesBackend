import { VotesController } from './../votes/votes.controller';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Candidates } from 'src/modules/candidates/candidates';
import { DataSource, Repository } from 'typeorm';
import { VotesService } from '../votes/votes.service';
import { Elections } from 'src/modules/elections/elections';
import e from 'express';
import { log } from 'console';

@Injectable()
export class CandidatesService {
        isCandidateTiedToElection(electionsCandidates: Elections, id: number) {
            throw new Error('Method not implemented.');
        }
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

        public async getAllCandidatesByElection(id_election: number): Promise<any> {
            log('Obteniendo candidatos para la elección con ID:', id_election);
            const candidates = await this.candidateRepositorio.find({ where: { id_election } });
            log('Candidatos encontrados:', candidates);
            return candidates;
        }

        public async newCandidate(objCandidates: Candidates[]): Promise<any> {
            log('Iniciando proceso de creación de candidatos:', objCandidates);
            if (objCandidates.length === 0) {
                throw new HttpException('No se proporcionaron candidatos para crear', HttpStatus.ACCEPTED);
            }

            try {
                const candidatesToSave: Candidates[] = [];
                for (const candidate of objCandidates) {
                    const id_election = candidate.electionsCandidates?.id || candidate.id_election;
                    const userId = candidate.id_user;
                    if (!userId || !id_election) {
                        throw new HttpException('Datos de usuario o elección inválidos', HttpStatus.BAD_REQUEST);
                    }
                    const existingCandidate = await this.candidateRepositorio.findOne({
                        where: { id_election: id_election, id_user: userId }
                    });
                    log('candidato existente:', existingCandidate);
                    if (!existingCandidate) {
                        const newCandidate = this.candidateRepositorio.create({
                            ...candidate,
                            id_election,
                            id_user: userId
                        });
                        candidatesToSave.push(newCandidate);
                        log('Candidato preparado para guardar:', newCandidate);
                    }
                }
                if (candidatesToSave.length === 0) {
                    return new HttpException('No hay candidatos nuevos para guardar', HttpStatus.ACCEPTED);
                }
                const savedCandidates = await this.candidateRepositorio.save(candidatesToSave);
                candidatesToSave.forEach(candidate => {
                    log('Candidato a eliminar de votante si existe:', candidate);
                    const votesService = new VotesService(this.candidateRepositorio.manager.connection);
                    votesService.deleteVoteInElection(candidate.id_user, candidate.electionsCandidates.id);
                });

                return savedCandidates;
            } catch (error) {
                log('Error al crear candidatos:', error);
                throw new HttpException('Error al crear candidatos', HttpStatus.BAD_REQUEST);
            }
        }
        public async deleteCandidateInElection(id_user: number, id_election: number): Promise<any> {
            try {
                const result = await this.candidateRepositorio.delete({ id_user, id_election });
                if (result.affected && result.affected > 0) {
                    return { message: 'Candidato eliminado correctamente' };
                } else {
                    return new HttpException('Candidato no encontrado', HttpStatus.NOT_FOUND);
                }
            } catch (error) {
                throw new HttpException('Error al eliminar el candidato', HttpStatus.BAD_REQUEST);
            }
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

        public async cleanService(): Promise<any> {
            
            const candidates = await this.candidateRepositorio.find({ relations: ['electionsCandidates'] });
            const toRemove: Candidates[] = [];

            for (const candidate of candidates) {
                if (candidate.electionsCandidates && candidate.id_election !== candidate.electionsCandidates.id) {
                    toRemove.push(candidate);
                }
            }

            if (toRemove.length > 0) {
                await this.candidateRepositorio.remove(toRemove);
                return { removed: toRemove.length };
            }

            return { removed: 0 };
            
        }

        public async deleteCandidates(candidateIds: number[], election_id: number): Promise<any> {
            try {
            const eliminados: number[] = [];
            const ignorados: number[] = [];

            for (const candidateId of candidateIds) {
                const candidate = await this.candidateRepositorio.findOne({ where: { id_user: candidateId, id_election: election_id } });
                if (candidate) {
                await this.candidateRepositorio.delete({ id_user: candidateId, id_election: election_id });
                eliminados.push(candidateId);
                } else {
                ignorados.push(candidateId);
                }
            }

            if (eliminados.length === 0) {
                return new HttpException('Candidatos no encontrados', HttpStatus.NOT_FOUND);
            }

            return {
                message: 'Candidatos eliminados correctamente',
                eliminados,
                ignorados
            };
            } catch (error) {
                log('Error al eliminar candidatos:', error);
            throw new HttpException('Error al eliminar los candidatos', HttpStatus.BAD_REQUEST);
            }
        }

        public async getCandidatesByUserId(userId: number): Promise<Candidates[]> {
            return this.candidateRepositorio.find({ where: { id_user: userId } });
        }

        public async getElectionsByUserId(userId: number): Promise<Elections[]> {
            const candidates = await this.candidateRepositorio.find({
            where: { id_user: userId },
            relations: ['electionsCandidates.candidatesElections']
            });
            return candidates
            .map(candidate => candidate.electionsCandidates)
            .filter((election): election is Elections => !!election);
        }

        public async updateCandidateByString(id: number, updateValue: string): Promise<any> {
            try {
            console.log('Actualizando candidato con ID:', id, 'con valor:', updateValue);
            const candidates = await this.getCandidateById(id);
            if (!candidates || candidates.length === 0) {
                return new HttpException('Candidato no encontrado', HttpStatus.NOT_FOUND);
            }
            const candidate = candidates[0];
            candidate.proposals = updateValue;
            console.log('Objeto a actualizar:', candidate);
            const updatedCandidate = await this.candidateRepositorio.update(candidate.id, candidate);
            return updatedCandidate;
                }
             catch (error) {
                console.error('Error al actualizar candidato:', error);
                return new HttpException('Error al actualizar candidato', HttpStatus.BAD_REQUEST);
            }
        }
}
