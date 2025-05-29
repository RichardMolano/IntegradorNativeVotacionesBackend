import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from 'src/modules/student/student';

@Controller('student')
export class StudentController {
      constructor(private readonly studentService: StudentService) {

        }
    
        @Get('FindAll')
        public getStudents(): any {
            return this.studentService.getStudents();
        }

    
        @Get('findOne/:id')
        public getStudentById(@Param() params:any): any {
            const id = Number(params.id);
            if (!isNaN(id)) {
                return this.studentService.getStudentById(id);

            } else {
                return new HttpException('Id no valido',
                     HttpStatus.NOT_ACCEPTABLE);
                
            }
        }

        @Post('newStudent')
        public newStudent(@Req() request: any): any {
            const objStudent: Student = request.body as Student;
            objStudent.id_faculty = request.body.faculty.id;
            return this.studentService.newStudent(objStudent);
        }
    
        @Put('update')
        public updateStudent(@Req() request: any): any {
          const objUpdate: Student = request.body as Student;
          return this.studentService.updateStudent(objUpdate.id_user, objUpdate);
        }

        @Put('update/:id')
        public updateStudentById(@Param() params:any, @Req() request: any): any {

            const id = Number(params.id)
            const objUpdate: Student = request.body;
            if (!isNaN(id)) {
                return this.studentService.updateStudent(id, objUpdate);
            }else{
                return new HttpException('Id no valido',409);
    
            }
        }
    
        @Delete('delete/:id')

        public deleteStudent(@Param() params: any): any {
            const id = Number(params.id);
            if (!isNaN(id)) {
                return this.studentService.delete(id);
            } else {
                return new HttpException('Id no valido', HttpStatus.NOT_ACCEPTABLE);
            }
        }
    
}
