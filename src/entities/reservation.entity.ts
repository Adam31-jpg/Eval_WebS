import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
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

  @OneToMany(() => UserEntity, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;

  @Column({
    type: 'int',
  })
  room_id: number;

  @OneToMany(() => RoomEntity, (room) => room.id)
  room?: RoomEntity;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  validatesTimes() {
    if (this.start_time >= this.end_time) {
      throw new Error('Wrong Start date');
    }
  }
  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column({ type: 'varchar' })
  status: StatusEnum;
}
