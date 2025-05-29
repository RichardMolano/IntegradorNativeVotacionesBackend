import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Candidates } from "../candidates/candidates";
import { Votes } from "../votes/votes";

@Entity('elections', { schema: "public" })
export class Elections {

    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    public id: number;

    @Column({ type: "varchar", name: "name", nullable: false, length: 255 })
    public name: string;

    @Column({ type: "varchar", name: "codeJoin", nullable: true, unique: true })
    public codeJoin: string;

    @Column({ type: "date", name: "start_date", nullable: false })
    public start_date: Date;

    @Column({ type: "date", name: "end_date", nullable: false })
    public end_date: Date;

    @Column({ type: "boolean", name: "state", nullable: false, default: () => "false" })
    public state: boolean;

    @OneToMany(() => Candidates, (candidates) => candidates.electionsCandidates)
    public candidatesElections: Candidates[];

    @OneToMany(() => Votes, (votes) => votes.electionsVotes)
    public votesElections: Votes[]; 
}
