import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { Faculty } from 'src/modules/faculty/faculty';
import { FacultyService } from './faculty.service';

@Controller('faculty')
export class FacultyController {

     constructor(private readonly facultyService: FacultyService) {

        }
    
        @Get('FindAll')
        public getFaculties(): any {
            return this.facultyService.getFaculties();
        }

        @Get('findOne/:id')
        public getFacultyById(@Param() params:any): any {
            const id = Number(params.id);
            if (!isNaN(id)) {
                return this.facultyService.getFacultyById(id);

            } else {
                return new HttpException('Id no valido',
                     HttpStatus.NOT_ACCEPTABLE);
                
            }
        }

        @Post('newFaculty')
        public newFaculty(@Req() request: any): any {
            const objFaculty: Faculty = request.body as Faculty;
            return this.facultyService.newFaculty(objFaculty);
        }

        @Put('update')
        public updateFaculty(@Req() request: any): any {
          const objUpdate: Faculty = request.body as Faculty;
          return this.facultyService.updateFaculty(objUpdate.id, objUpdate);
        }

        @Put('update/:id')
        public updateFacultyById(@Param() params:any, @Req() request: any): any {

            const id = Number(params.id)
            const objUpdate: Faculty = request.body;
            if (!isNaN(id)) {
                const objUpdate: Faculty = request.body as Faculty;
                return this.facultyService.updateFaculty(id, objUpdate);
            }else{
                return new HttpException('Id no valido',409);
    
            }
        }
    
        @Delete('delete/:id')

        public deleteFaculty(@Param() params: any): any {
            const id = Number(params.id);
            if (!isNaN(id)) {
                return this.facultyService.delete(id);
            } else {
                return new HttpException('Id no valido', HttpStatus.NOT_ACCEPTABLE);
            }
        }
}
