import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ReservationEntity } from './reservation.entity';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'int',
  })
  reservation_id: number;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.id)
  reservation?: ReservationEntity;

  @Column({ type: 'varchar' })
  message: string;

  @CreateDateColumn({ type: 'timestamp' })
  notification_date: Date;

  @Column({ type: 'boolean', default: 0 })
  is_sent: boolean;
}
