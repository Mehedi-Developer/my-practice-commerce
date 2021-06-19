import { Permission } from "src/permission/entities/permission.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Permission, {eager: true})
    @JoinTable({name: "role_permission"})
    permission: Permission[];
}
