import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../role/role";
import { Student } from "../student/student";
import { Candidates } from "../candidates/candidates";
import { Votes } from "../votes/votes";

@Entity('users',{schema:"public", name:"users"})
export class User {
    @PrimaryGeneratedColumn({type:"integer", name:"id"})
    public id: number;

    @Column({type:"varchar", name:"name", nullable:false, length: 255})
    public name: string;

    @Column({type:"varchar", name:"document", nullable:false, length: 255})
    public document: string;

    @Column({type:"varchar", name:"email", nullable:false, length: 500})
    public email: string;

    @Column({type:"varchar", name:"password", nullable:false, length: 500})
    public password: string;

    @Column({type:"integer", name:"id_role", nullable:false})
    public id_role: number;

    @ManyToOne(() => Role, (role) => role.usersRole, {onDelete: 'RESTRICT', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'id_role', referencedColumnName: 'id'})
    public roleUser: Role;

    @OneToOne(() => Student, (student) => student.userStudent)
    public studentUser: Student;


    constructor(id: number, name: string, document: string, email: string, password: string, id_role: number) {
        this.id = id;
        this.name = name;
        this.document = document;
        this.email = email;
        this.password = password;
        this.id_role = id_role;
    }

}
