import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/user';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
    private userRepositorio: Repository<User>;
    constructor(poolConexion: DataSource) {
            this.userRepositorio = poolConexion.getRepository(User);
        }

    async getUserById(id: number): Promise<any> {
        const datosUsuario = await this.userRepositorio.findOne({ where: { id }, relations: ['roleUser'] });
        return datosUsuario;
    }
    async getAllUsers(): Promise<User[]> {
        const users = await this.userRepositorio.find({ relations: ['roleUser'] });
        return users.map(user => ({
            ...user,
            password: "" // Hide password
        }));
    }
    createUser(userData: User): Promise<User> {
        const newUser = this.userRepositorio.create(userData);
        return this.userRepositorio.save(newUser);
    }

    async updateUser(id: number, userData: User): Promise<User> {
        await this.userRepositorio.update(id, userData);
        // Recupera el usuario actualizado
        const updatedUser = await this.userRepositorio.findOne({ where: { id }, relations: ['roleUser'] });
        if (!updatedUser) {
            throw new Error(`User with id ${id} not found`);
        }
        return updatedUser;
    }
    deleteUser(id: number): Promise<any> {
        return this.userRepositorio.delete({ id });
    }
}
