import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user";

import { Faculty } from "../faculty/faculty";

@Entity('students', { schema: "public" })
export class Student {

    @PrimaryColumn({type:"integer", name:"id_user", nullable:false})
    public id_user: number;

    @Column({type:"integer", name:"id_faculty", nullable:false})
    public id_faculty: number;

    @Column({type:"integer", name:"semester", nullable:false})
    public semester: number;

    @OneToOne(() => User, (user) => user.studentUser)
    @JoinColumn({ name: 'id_user', referencedColumnName: 'id' })
    public userStudent: User;

    @OneToOne(() => Faculty, (faculty) => faculty.studentFaculty)
    @JoinColumn({ name: 'id_faculty', referencedColumnName: 'id' })
    public facultyStudent: Faculty;

    constructor(id_user: number, id_faculty: number, semester: number) {
        this.id_user = id_user;
        this.id_faculty = id_faculty;
        this.semester = semester;
    }

}
