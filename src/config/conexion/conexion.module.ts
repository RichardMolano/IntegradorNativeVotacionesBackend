import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidates } from 'src/modules/candidates/candidates';
import { Elections } from 'src/modules/elections/elections';
import { Faculty } from 'src/modules/faculty/faculty';
import { Role } from 'src/modules/role/role';
import { Student } from 'src/modules/student/student';
import { User } from 'src/modules/user/user';
import { Votes } from 'src/modules/votes/votes';
import { DataSource } from 'typeorm';



@Global()
@Module({
  imports: [],
  exports: [DataSource],
  providers: [{
    provide: DataSource,
    useFactory: async() => {
        try{
        
            const poolConexion = new DataSource({
                type: 'postgres',
                url: process.env.SUPABASE_URL,
                entities: [User, Role, Candidates, Elections, Faculty, Student, Votes],
                synchronize: true,
            });

        await poolConexion.initialize()
        .then(() => {
            console.log('Conectado a la base de datos');
        })
        return poolConexion;
        
        } catch (error) {
            console.error('Fallo en la conexion de la base de datos', error);
            throw error;
        }
    },
  }],
})
export class ConexionModule {}
