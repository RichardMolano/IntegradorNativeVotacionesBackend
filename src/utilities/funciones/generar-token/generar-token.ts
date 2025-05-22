import { sign } from 'jsonwebtoken';
import { User } from 'src/modules/user/user';

export class GenerarToken {
  public static procesarRespuesta(respuesta: User): string {
    let token = '';

    token = sign(
      {
        id: respuesta.id,
        name: respuesta.name,
        email: respuesta.email,
        role: respuesta.roleUser
    
      },
      String(process.env.SECRET_PASSWORD),
      { expiresIn: '8h' },
    );

    return token;
  }
}
