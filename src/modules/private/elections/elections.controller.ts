import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { ElectionsService } from './elections.service';
import { Elections } from 'src/modules/elections/elections';

@Controller('elections')
export class ElectionsController {

     constructor(private readonly electionsService: ElectionsService) {

        }
    
        @Get('FindAll')
        public getElections(): any {
            return this.electionsService.getElections();
        }

        @Get('forVotant/:id_user')
        public async getElectionsForVotant(@Param('id_user') id_user: number): Promise<any> {
            return this.electionsService.getElectionsForVotant(id_user);
        }

        @Get('forCandidate/:id_user')
        public async getElectionsForCandidate(@Param('id_user') id_user: number): Promise<any> {
            return this.electionsService.getElectionsForCandidate(id_user);
        }

        @Get('findOne/:id')
        public getElectionById(@Param() params:any): any {
            const id = Number(params.id);
            if (!isNaN(id)) {
                return this.electionsService.getElectionById(id);

            } else {
                return new HttpException('Id no valido',
                     HttpStatus.NOT_ACCEPTABLE);
            }
        }
        @Get('getResults/:id')
        public getElectionResults(@Param('id') id_user: number): any {
            return this.electionsService.getElectionResults(id_user);
        }

        @Post('newElection')
        public newElection(@Req() request: any): any {
            const objElection: Elections = request.body as Elections;
            return this.electionsService.newElection(objElection);
        }

        @Put('update')
        public updateElection(@Req() request: any): any {
          const objUpdate: Elections = request.body as Elections;
          return this.electionsService.updateElection(objUpdate.id, objUpdate);
        }

        @Put('update/:id')
        public updateElectionById(@Param() params:any, @Req() request: any): any {

            const id = Number(params.id)
            const objUpdate: Elections = request.body;
            if (!isNaN(id)) {
                const objUpdate: Elections = request.body as Elections;
                return this.electionsService.updateElection(id, objUpdate);
            }else{
                return new HttpException('Id no valido',409);
            }
        }
    
        @Delete('delete/:id')
        public deleteElection(@Param() params: any): any {
            const id = Number(params.id);
            if (!isNaN(id)) {
                return this.electionsService.delete(id);
            } else {
                return new HttpException('Id no valido', HttpStatus.NOT_ACCEPTABLE);
            }
        }

        
}
