import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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

  @Column({ type: 'timestamp' })
  notifiacation_date: Date;

  @Column({ type: 'bit', default: 0 })
  is_sent: boolean;
}
