import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { VotesService } from './votes.service';
import { Votes } from 'src/modules/votes/votes';

@Controller('votes')
export class VotesController {


         constructor(private readonly votesService: VotesService) {

        }
    
        @Get('FindAll')
        public getVotes(): any {
            return this.votesService.getVotes();
        }
    
        @Get('findOne/:id')
        public getVoteById(@Param() params:any): any {
            const id = Number(params.id);
            if (!isNaN(id)) {
                return this.votesService.getVoteById(id);
    
            } else {
                return new HttpException('Id no valido',
                     HttpStatus.NOT_ACCEPTABLE);
                
            }
        }

        @Post('newVote')
        public newVote(@Req() request: any): any {
            const objVote: Votes = request.body as Votes;
            return this.votesService.newVote(objVote);
        }

        @Put('update')
        public updateVote(@Req() request: any): any {
          const objUpdate: Votes = request.body as Votes;
          return this.votesService.updateVote(objUpdate.id, objUpdate);
        }

        @Put('update/:id')
        public updateVoteById(@Param() params:any, @Req() request: any): any {

            const id = Number(params.id)
            const objUpdate: Votes = request.body;
            if (!isNaN(id)) {
                return this.votesService.updateVote(id, objUpdate);
            }else{
                return new HttpException('Id no valido',409);
    
            }
        }
    
        @Delete('delete/:id')

        public deleteVote(@Param() params: any): any {
            const id = Number(params.id);
            if (!isNaN(id)) {
                return this.votesService.delete(id);
            } else {
                return new HttpException('Id no valido', HttpStatus.NOT_ACCEPTABLE);
            }
        }
}
