import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Candidates } from "../candidates/candidates";
import { Elections } from "../elections/elections";
import { Student } from "../student/student";

@Entity('votes', { schema: "public" })
export class Votes {

    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    public id: number;

    @Column({ type: "integer", name: "id_candidate", nullable: true })
    public id_candidate?: number;

    @Column({ type: "integer", name: "id_user", nullable: false })
    public id_user: number;

    @Column({ type: "integer", name: "id_election", nullable: false })
    public id_election: number;

    @Column({ type: "date", name: "date", nullable: false })
    public date: Date;

    @Column({ type: "boolean", name: "state", nullable: false, default: () => "false" })
    public state: boolean;
    
    @ManyToOne(() => Candidates, (candidates) => candidates.electionsCandidates, { nullable: true })
    @JoinColumn({ name: 'id_candidate', referencedColumnName: 'id' })
    public candidatesVotes?: Candidates | null;

    @ManyToOne(() => Student, (student) => student.votesUser)
    @JoinColumn({ name: 'id_user', referencedColumnName: 'id_user' })
    public userVotes: Student[];

    @ManyToOne(() => Elections, (elections) => elections.votesElections)
    @JoinColumn({ name: 'id_election', referencedColumnName: 'id' })
    public electionsVotes: Elections[];
}
