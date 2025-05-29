import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Votes } from 'src/modules/votes/votes';
import { DataSource, Repository } from 'typeorm';
import { CandidatesService } from 'src/modules/private/candidates/candidates.service';
import { response } from 'express';
import { log } from 'console';

@Injectable()
export class VotesService {

       private votesRepositorio: Repository<Votes>;

        constructor(poolConexion: DataSource) {
            this.votesRepositorio = poolConexion.getRepository(Votes);
        }
        public async getVotesById(id: number): Promise<any> {
            const vote = await this.votesRepositorio.findOne({ where: { id } });
            if (!vote) {
                throw new HttpException('Voto no encontrado', HttpStatus.NOT_FOUND);
            }
            return vote;
        }

        public async getVotes( id_election: number): Promise<any> {
            const candidatesService = new CandidatesService(this.votesRepositorio.manager.connection);
            const votes = await this.votesRepositorio.find({ where: { id_election } });
            const candidates = await candidatesService.getAllCandidatesByElection(id_election);
            log('Obteniendo votos para la elección con ID:', id_election);
            log('Candidatos encontrados:', candidates);
           return { Candidates: candidates, votes };
        }

        public async newVote(objVote: any[]): Promise<any> {
            if (objVote.length === 0) {
                console.warn('No se proporcionaron votos para crear');
                return new HttpException('No se proporcionaron votos para crear', HttpStatus.ACCEPTED);
            }

            try {
            console.log('Iniciando proceso de creación de votos:', objVote);
            const votesToSave: Votes[] = [];
            for (const vote of objVote) {
                const id_user = vote.user?.id;
                const id_election = vote.election?.id
                console.log('Procesando voto:', vote);
                console.log('ID de usuario:', id_user);
                console.log('ID de elección:', id_election);
                if (!id_user || !id_election) {
                console.error('Datos de usuario o elección inválidos:', vote);
                throw new HttpException('Datos de usuario o elección inválidos', HttpStatus.BAD_REQUEST);
                }
                const existingVote = await this.votesRepositorio.findOne({
                where: { id_user, id_election }
                });
                if (!existingVote) {
                // Create a Votes entity with the required fields
                const newVote = this.votesRepositorio.create({
                    id_user,
                    id_election,
                    date: vote.date,
                    state: vote.state
                });
                votesToSave.push(newVote);
                } else {
                }
            }
            if (votesToSave.length === 0) {
                console.warn('No hay votos nuevos para guardar');
                return new HttpException('No se proporcionaron votos para crear', HttpStatus.ACCEPTED);

            }
            const savedVotes = await this.votesRepositorio.save(votesToSave);
            votesToSave.forEach(vote => {
                log('Candidato a eliminar de votante si existe:', vote);
                const votesService = new CandidatesService(this.votesRepositorio.manager.connection);
                votesService.deleteCandidateInElection(vote.id_user, vote.id_election);
            });

            return savedVotes;
            } catch (error) {
            console.error('Error al crear votos:', error);
            throw new HttpException('Error al crear votos', HttpStatus.BAD_REQUEST);
            }
        }

        public async voteElectionCandidate(cod: number, cand_id: number):Promise<any>{
            return this.votesRepositorio.update({id: cod}, {id_candidate: cand_id}).then((response) => {
                return new HttpException(JSON.stringify({
                    "Actualizar": response,
                    "Actualizado": {id_candidate: cand_id}
                }), HttpStatus.OK);
    
            }).catch((error) => {
                return new HttpException('Error al actualizar voto', HttpStatus.BAD_REQUEST);
            });
        }

        public async deleteVoteInElection(id_user: number, id_election: number): Promise<any> {
            try {
                const result = await this.votesRepositorio.delete({ id_user, id_election });
                if (result.affected && result.affected > 0) {
                    return { message: 'Voto eliminado correctamente' };
                } else {
                    return new HttpException('Voto no encontrado', HttpStatus.NOT_FOUND);
                }
            } catch (error) {
                throw new HttpException('Error al eliminar el voto', HttpStatus.BAD_REQUEST);
            }
        }

        public async deleteVotes(voteIds: number[], election_id: number): Promise<any> {
            console.log('Iniciando proceso de eliminación de votos:', voteIds, 'para la elección:', election_id);
            try {
            const eliminados: number[] = [];
            const ignorados: number[] = [];

            for (const voteId of voteIds) {
                const vote = await this.votesRepositorio.findOne({ where: { id_user: voteId, id_election: election_id } });
                if (vote) {
                await this.votesRepositorio.delete({ id_user: voteId, id_election: election_id });
                eliminados.push(voteId);
                } else {
                ignorados.push(voteId);
                }
            }

            if (eliminados.length === 0) {
                return new HttpException('Votos no encontrados', HttpStatus.NOT_FOUND);
            }

            return {
                message: 'Votos eliminados correctamente',
                eliminados,
                ignorados
            };
            } catch (error) {
                console.error('Error al eliminar los votos:', error);
            throw new HttpException('Error al eliminar los votos', HttpStatus.BAD_REQUEST);
            }
        }

        public async getVotesByUser(id_user: number): Promise<any> {
            const votes = await this.votesRepositorio.find({ where: { id_user } , relations: ['electionsVotes' , 'electionsVotes.candidatesElections.userStudent.userStudent'] });
            if (!votes || votes.length === 0) {
            throw new HttpException('No se encontraron votos para el usuario', HttpStatus.NOT_FOUND);
            }
            return votes;
        }

        

}
