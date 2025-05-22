import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Candidates } from "../candidates/candidates";
import { User } from "../user/user";
import { Elections } from "../elections/elections";

@Entity('votes', { schema: "public" })
export class Votes {

    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    public id: number;

    @Column({ type: "integer", name: "id_candidate", nullable: false })
    public id_candidate: number;

    @Column({ type: "integer", name: "id_user", nullable: false })
    public id_user: number;

    @Column({ type: "integer", name: "id_election", nullable: false })
    public id_election: number;

    @Column({ type: "date", name: "date", nullable: false })
    public date: Date;

    @Column({ type: "boolean", name: "state", nullable: false, default: () => "false" })
    public state: boolean;

    @ManyToOne(() => Candidates, (candidates) => candidates.electionsCandidates)
    @JoinColumn({ name: 'id_candidate', referencedColumnName: 'id' })
    public candidatesVotes: Candidates[];

    @OneToOne(() => User, (user) => user.votesUser)
    @JoinColumn({ name: 'id_user', referencedColumnName: 'id' })
    public userVotes: User;

    @OneToOne(() => Elections, (elections) => elections.votesElections)
    @JoinColumn({ name: 'id_election', referencedColumnName: 'id' })
    public electionsVotes: Elections;
}
