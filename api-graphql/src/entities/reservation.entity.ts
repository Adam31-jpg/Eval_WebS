import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { RoomEntity } from './room.entity';
import { StatusEnum } from './status.enum';
import { UserEntity } from './user.entity';

@Entity('reservations')
export class ReservationEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'int',
  })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;

  @Column({
    type: 'int',
  })
  roomId: number;

  @OneToMany(() => RoomEntity, (room) => room.id)
  room?: RoomEntity;

  @Column({ type: 'varchar' })
  location: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  validatesTimes() {
    if (this.startTime >= this.endTime) {
      throw new Error('La date de début doit être antérieure à la date de fin');
    }
  }

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'varchar' })
  status: StatusEnum;
}
