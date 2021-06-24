import { Permission } from "src/permission/entities/permission.entity";
import { Role } from "src/role/entities/role.entity";
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    // @Index({unique: true})
    email: string;

    @Column()
    // @Index({unique: true})
    mobile: string;

    @Column()
    password: string;

    @ManyToOne(() => Role)
    @JoinColumn({ name: "user_role"})
    role: Role;

    @ManyToMany(() => Permission, {eager: true})
    // @ManyToMany(() => Permission, per=>per.users, {eager: true})
    @JoinTable({name: "user_permission"})
    permission: Permission[];

}
