import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user";

import { Faculty } from "../faculty/faculty";
import { Candidates } from "../candidates/candidates";
import { Votes } from "../votes/votes";

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

    @ManyToOne(() => Faculty, (faculty) => faculty.studentFaculty)
    @JoinColumn({ name: 'id_faculty', referencedColumnName: 'id' })
    public facultyStudent: Faculty;

    @OneToMany(() => Candidates, (candidates) => candidates.userStudent)
    public candidatesUser: Candidates[];

    @OneToMany(() => Votes, (votes) => votes.userVotes)
    public votesUser: Votes[];

    constructor(id_user: number, id_faculty: number, semester: number) {
        this.id_user = id_user;
        this.id_faculty = id_faculty;
        this.semester = semester;
    }

}
