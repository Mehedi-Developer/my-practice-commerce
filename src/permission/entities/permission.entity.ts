import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    // @Index({ unique: true })
    name: string;
    
}
