import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { Candidates } from 'src/modules/candidates/candidates';

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
            const objCandidate: Candidates = request.body as Candidates;
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
    
        @Delete('delete/:id')

        public deleteCandidate(@Param() params: any): any {
            const id = Number(params.id);
            if (!isNaN(id)) {
                return this.candidateService.delete(id);
            } else {
                return new HttpException('Id no valido', HttpStatus.NOT_ACCEPTABLE);
            }
        }
}
