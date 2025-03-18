import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { StatusEnum } from './status.enum';
import { RoomEntity } from './room.entity';

@Entity('reservations')
export class ReservationEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'int',
  })
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;

  @Column({
    type: 'int',
  })
  room_id: number;

  @ManyToOne(() => RoomEntity, (room) => room.id)
  room?: RoomEntity;

  @Column({ type: 'varchar' })
  location: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at?: string;

  @BeforeInsert()
  @BeforeUpdate()
  validatesTimes() {
    if (this.start_time >= this.end_time) {
      throw new Error('Wrong Start date');
    }
  }
  @Column({ type: 'timestamp' })
  start_time: string;

  @Column({ type: 'timestamp' })
  end_time: string;

  @Column({ type: 'varchar' })
  status: StatusEnum;
}
