import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Student } from 'src/modules/student/student';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class StudentService {

     private studentRepositorio: Repository<Student>;

        constructor(poolConexion: DataSource) {
            this.studentRepositorio = poolConexion.getRepository(Student);
        }

        public async getStudents(): Promise<any> {
            return this.studentRepositorio.find();
        }

        public async getStudentById(id: number): Promise<any> {
            return this.studentRepositorio.findBy({ id_user: id });
        }

        public async newStudent(objStudent: Student):Promise<any> {

            return this.studentRepositorio.save(objStudent).then((response) => {
               return response;
            }).catch((error) => {
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
