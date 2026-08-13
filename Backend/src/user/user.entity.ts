import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  WORKER = 'worker',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({select: false})
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.WORKER,
  })
  role!: UserRole;
}