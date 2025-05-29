import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { Candidates } from 'src/modules/candidates/candidates';
import { log } from 'console';

@Controller('candidates')
export class CandidatesController {

    constructor(private readonly candidateService: CandidatesService) {

        }
    
        @Get('FindAll')
        public getCandidates(): any {
            return this.candidateService.getCandidates();
        }

        @Get('findOne/:id')
        public getCandidateById(@Param() params:any): any {
            const id = Number(params.id);
            if (!isNaN(id)) {
                return this.candidateService.getCandidateById(id);

            } else {
                return new HttpException('Id no valido',
                     HttpStatus.NOT_ACCEPTABLE);
            }
        }

        @Post('newCandidate')
        public newCandidate(@Req() request: any): any {
            const objCandidate: Candidates[] = request.body as Candidates[];
            return this.candidateService.newCandidate(objCandidate);
        }

        @Put('update')
        public updateCandidate(@Req() request: any): any {
          const objUpdate: Candidates = request.body as Candidates;
          return this.candidateService.updateCandidate(objUpdate.id, objUpdate);
        }
    
        @Put('update/:id')
        public updateCandidateById(@Param() params:any, @Req() request: any): any {

            const id = Number(params.id)
            const objUpdate: Candidates = request.body;
            if (!isNaN(id)) {
                const objUpdate: Candidates = request.body as Candidates;
                return this.candidateService.updateCandidate(id, objUpdate);
            }else{
                return new HttpException('Id no valido',409);
    
            }
        }
    
        @Post('deleteCandidates')
        public async deleteCandidates(@Req() request: any): Promise<any> {
            log('Iniciando proceso de eliminación de candidatos:', request.body);
            const candidateIds: number[] = request.body.ids;
            const electionId: number = Number(request.body.election_id);
            if (!Array.isArray(candidateIds) || candidateIds.some(id => isNaN(Number(id)))) {
                throw new HttpException('Lista de IDs de candidatos no válida', HttpStatus.NOT_ACCEPTABLE);
            }
            if (isNaN(electionId)) {
                throw new HttpException('Id de elección no válido', HttpStatus.NOT_ACCEPTABLE);
            }
            return await this.candidateService.deleteCandidates(candidateIds, electionId);
        }

        @Get('byUser/:userId')
        public async getCandidatesByUserId(@Param('userId') userId: string): Promise<Candidates[]> {
            const id = Number(userId);
            if (isNaN(id)) {
                throw new HttpException('Id de usuario no válido', HttpStatus.NOT_ACCEPTABLE);
            }
            return this.candidateService.getCandidatesByUserId(id);
        }

        @Get('getElectionsByUserId/:userId')
        public async getElectionsByUserId(@Param('userId') userId: string): Promise<any> {
            const id = Number(userId);
            if (isNaN(id)) {
                throw new HttpException('Id de usuario no válido', HttpStatus.NOT_ACCEPTABLE);
            }
            return this.candidateService.getElectionsByUserId(id);
        }

        @Put('updateCandidateStatus/:id')
        public async updateCandidateStatus(@Param('id') id: string, @Req() request: any): Promise<any> {
            const status = request.body.charge;
            if (!status) {
                throw new HttpException('Estado no proporcionado', HttpStatus.BAD_REQUEST);
            }
            return this.candidateService.updateCandidateByString(Number(id), status);
        }
}
