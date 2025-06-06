import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "../student/student";

@Entity('faculty', { schema: "public" })
export class Faculty {

    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    public id: number;

    @Column({ type: "varchar", name: "name", nullable: false, length: 200 })
    public name: string;

    @OneToMany(() => Student, (student) => student.facultyStudent)
    public studentFaculty: Student[];
}
