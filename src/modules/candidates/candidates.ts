import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Elections } from "../elections/elections";
import { Student } from "../student/student";
import { User } from "../user/user";
import { Votes } from "../votes/votes";

@Entity('candidates', { schema: "public" })
export class Candidates {

    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    public id: number;

    @Column({ type: "integer", name: "id_election", nullable: false })
    public id_election: number;

    @Column({ type: "integer", name: "id_user", nullable: false })
    public id_user: number;

    @Column({ type: "text", name: "proposals", nullable: false })
    public proposals: string;

    @ManyToOne(() => Elections, (elections) => elections.candidatesElections)
    @JoinColumn({ name: 'id_election', referencedColumnName: 'id' })
    public electionsCandidates: Elections;

    @ManyToOne(() => Student, (student) => student.candidatesUser)
    @JoinColumn({ name: 'id_user', referencedColumnName: 'id_user' })
    public userStudent: Student[];

    @OneToMany(() => Votes, (votes) => votes.candidatesVotes)
    public votesCandidates: Votes[];

    constructor(id: number, id_election: number, id_user: number, proposals: string) {
        this.id = id;
        this.id_election = id_election;
        this.id_user = id_user;
        this.proposals = proposals;
    }
}
