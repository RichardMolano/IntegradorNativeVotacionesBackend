import { HttpException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/modules/user/user';
import { compareSync } from 'bcrypt';
import { GenerarToken } from 'src/utilities/funciones/generar-token/generar-token';

@Injectable()
export class AuthenticationService {

    private UsuarioRepo: Repository<User>;
    constructor(private poolConexion: DataSource) {
        this.UsuarioRepo = this.poolConexion.getRepository(User);
    
    }

    public async inicioSesion(objUsuario: User):Promise<any>{
        const existe = await this.UsuarioRepo.findBy({
            email: objUsuario.email,
        });

        if (existe.length != 0) {
          
            const idUsuario = existe[0].id;
            const claveUsuario = existe[0].password;

            if (compareSync(objUsuario.password, claveUsuario)) {
                
                try{
                    const datosUsuario = await this.UsuarioRepo.findOne({where: {id: idUsuario}, relations:['roleUser']});
                    
                    if (!datosUsuario){
                        throw new HttpException('Error al obtener los datos del usuario', 404);
                    }

                    const token = GenerarToken.procesarRespuesta(datosUsuario);

                    return new HttpException({"tokenApp": token}, 200)
                        
                } catch (error) {
                    console.error('Error al iniciar sesión', error);
                    throw new HttpException('Error al iniciar sesión', 400);
                }
                
            } else {
                
                return new HttpException('Contraseña incorrecta', 406);
            }

        }else{
            return new HttpException('Usuario no existe', 404);
        }
    }
}
