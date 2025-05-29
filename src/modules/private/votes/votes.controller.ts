import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { VotesService } from './votes.service';
import { Votes } from 'src/modules/votes/votes';
import { log } from 'console';

@Controller('votes')
export class VotesController {


        constructor(private readonly votesService: VotesService) {}

        @Get('FindAll/:id_election')
        public async getVotes(@Param('id_election') id_election: string): Promise<any> {
            const electionId = Number(id_election);
            if (!isNaN(electionId)) {
                return await this.votesService.getVotes(electionId);
            } else {
                throw new HttpException('Id de elección no válido', HttpStatus.NOT_ACCEPTABLE);
            }
        }


        @Post('newVote')
        public async newVote(@Req() request: any): Promise<any> {
            const objVote: Votes[] = request.body as Votes[];
            return await this.votesService.newVote(objVote);
        }

        @Put('voteElectionCandidate')
        public async voteElectionCandidate(@Req() request: any): Promise<any> {
            const { voteId, candidateId } = request.body;
            const cod = Number(voteId);
            const caid = Number(candidateId);
            if (isNaN(cod) || isNaN(caid)) {
                throw new HttpException('Id de voto o candidato no válido', HttpStatus.NOT_ACCEPTABLE);
            }
            return await this.votesService.voteElectionCandidate(cod, caid);
        }

        @Post('deleteVotes')
        public async deleteVotes(@Req() request: any): Promise<any> {
            log('Iniciando proceso de eliminación de votos:', request.body);
            const voteIds: number[] = request.body.voteIds;
            const electionId: number = Number(request.body.election_id);
            if (!Array.isArray(voteIds) || voteIds.some(id => isNaN(Number(id)))) {
                throw new HttpException('Lista de IDs de votos no válida', HttpStatus.NOT_ACCEPTABLE);
            }
            if (isNaN(electionId)) {
                throw new HttpException('Id de elección no válido', HttpStatus.NOT_ACCEPTABLE);
            }
            return await this.votesService.deleteVotes(voteIds, electionId);
        }

        @Get('getVotesByUser/:id')
        public async getVotesByUser(@Param('id') id: number): Promise<any> {
            const id_user = Number(id);
            if (!isNaN(id_user)) {
                return await this.votesService.getVotesByUser(id_user);
            } else {
                throw new HttpException('Usuario no autenticado', HttpStatus.UNAUTHORIZED);
            }
        }


}
