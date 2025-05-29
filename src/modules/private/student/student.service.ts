import { User } from 'src/modules/user/user';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Student } from 'src/modules/student/student';
import { DataSource, Repository } from 'typeorm';
import { log } from 'console';

@Injectable()
export class StudentService {

     private studentRepositorio: Repository<Student>;

        constructor(poolConexion: DataSource) {
            this.studentRepositorio = poolConexion.getRepository(Student);
        }

        public async getStudents(): Promise<any> {
            const students = await this.studentRepositorio.find({ relations: ['userStudent'] });
            return students.map(student => {
                if (student.userStudent) {
                    const { password, ...userWithoutPassword } = student.userStudent;
                    return { ...student, userStudent: userWithoutPassword };
                }
                return student;
            });
        }

        public async getStudentById(id: number): Promise<any> {
            const student = await this.studentRepositorio.findOne({
            where: { id_user: id },
            relations: ['userStudent'],
            });
            if (student && student.userStudent) {
            const { password, ...userWithoutPassword } = student.userStudent;
            return { ...student, userStudent: userWithoutPassword };
            }
            return student;
        }

        public async newStudent(objStudent: Student):Promise<any> {

            log('Iniciando proceso de creación de estudiante:', objStudent);
            return this.studentRepositorio.save(objStudent).then((response) => {
               return response;
            }).catch((error) => {
                log('Error al crear estudiante:', error);
               return new HttpException('Error al crear estudiante', HttpStatus.BAD_REQUEST);
            })
        }

        public async updateStudent(cod: number, objUpdate: Student):Promise<any>{
            return this.studentRepositorio.update({id_user: cod}, objUpdate).then((response) => {

                return new HttpException(JSON.stringify({
                    "Actualizar": response,
                    "Actualizado": objUpdate
                }), HttpStatus.OK);
    
            }).catch((error) => {
                return new HttpException('Error al actualizar estudiante', HttpStatus.BAD_REQUEST);
            });
        }
    
        public async delete(id: number):Promise<any> {
            return this.studentRepositorio.delete({id_user: id}).then((response) => {
                return new HttpException('Estudiante eliminado', HttpStatus.OK);
            }).catch((error) => {
                return new HttpException('Error al eliminar estudiante', HttpStatus.BAD_REQUEST);
            });
        }
}
