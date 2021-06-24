import { Role } from "src/role/entities/role.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    // @Index({ unique: true })
    name: string;

    @ManyToMany(() => User, user => user.permission)
    users: User[];

    @ManyToMany(() => Role, role => role.permission)
    roles: Role[];
    
}
