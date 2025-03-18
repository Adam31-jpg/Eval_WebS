import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', unique: true })
  keycloak_id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'timestamp' })
  created_at: Date;
}
