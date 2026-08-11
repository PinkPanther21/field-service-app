import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum status {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}
@Entity('task')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id!:string

    @Column()
    title!:string

    @Column({nullable:true})
    description?:string

    @Column({
        type: 'enum',
        enum: status,
        default: status.PENDING,
    })
    status!:status

    @ManyToOne(()=> User, (user)=> user.role)
    @JoinColumn({name: 'assignedToId'})
    assignedTo!: User
    
    @ManyToOne(()=> User)
    @JoinColumn({name: 'createdById'})
    createdBy!:User
    
}
