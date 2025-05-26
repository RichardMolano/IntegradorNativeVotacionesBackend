import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user";

@Entity('roles',{schema:"public"})
export class Role {

    @PrimaryGeneratedColumn({type:"integer", name:"id"})
    public id: number;

    @Column({type:"varchar", name:"name", nullable:false, length: 200})
    public name: string;

    @OneToMany(() => User, (user) => user.roleUser)
    public usersRole?:User[];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

}
