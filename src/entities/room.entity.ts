import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({ type: 'int', default: 0, nullable: false })
  capacity: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'timestamp' })
  created_at: Date;
}
