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
