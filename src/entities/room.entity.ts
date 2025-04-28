import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ReservationEntity } from './reservation.entity';

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({ type: 'int', default: 0, nullable: false })
  capacity: number;

  @Column({ type: 'varchar' })
  location: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at?: string;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.room)
  reservations?: ReservationEntity[];
}
