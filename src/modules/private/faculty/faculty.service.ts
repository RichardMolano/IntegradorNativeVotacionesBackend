import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Faculty } from 'src/modules/faculty/faculty';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FacultyService {
     private facultyRepositorio: Repository<Faculty>;
    
        constructor(poolConexion: DataSource) {
            this.facultyRepositorio = poolConexion.getRepository(Faculty);
        }

        public async getFaculties(): Promise<any> {
            return this.facultyRepositorio.find();
        }

        public async getFacultyById(id: number): Promise<any> {
            return this.facultyRepositorio.findBy({ id: id });
        }

        public async newFaculty(objFaculty: Faculty):Promise<any> {

            return this.facultyRepositorio.save(objFaculty).then((response) => {
               return response;
            }).catch((error) => {
               return new HttpException('Error al crear facultad', HttpStatus.BAD_REQUEST);
            })
        }

        public async updateFaculty(cod: number, objUpdate: Faculty):Promise<any>{
            return this.facultyRepositorio.update({id: cod}, objUpdate).then((response) => {

                return new HttpException(JSON.stringify({
                    "Actualizar": response,
                    "Actualizado": objUpdate
                }), HttpStatus.OK);
    
            }).catch((error) => {
                return new HttpException('Error al actualizar facultad', HttpStatus.BAD_REQUEST);
            });
        }
    
        public async delete(id: number):Promise<any> {
            return this.facultyRepositorio.delete({id: id}).then((response) => {
                return new HttpException('Facultad eliminada', HttpStatus.OK);
            }).catch((error) => {
                return new HttpException('Error al eliminar facultad', HttpStatus.BAD_REQUEST);
            });
        }
}
