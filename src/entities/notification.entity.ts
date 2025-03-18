import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationEntity } from './reservation.entity';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'ID unique de la notification',
    example: '1',
  })
  id: string;

  @Column({
    type: 'int',
  })
  @ApiProperty({
    description: 'ID de la réservation associée',
    example: 1,
  })
  reservation_id: number;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.id)
  @ApiProperty({
    description: 'Données de la réservation',
    type: () => ReservationEntity,
    required: false,
  })
  reservation?: ReservationEntity;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Message de la notification',
    example: 'Votre réservation a été confirmée',
  })
  message: string;

  @Column({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date de la notification',
    example: '2025-03-18T10:30:00Z',
  })
  notifiacation_date: Date;

  @Column({ type: 'bit', default: 0 })
  @ApiProperty({
    description: 'Indique si la notification a été envoyée',
    example: false,
  })
  is_sent: boolean;
}
