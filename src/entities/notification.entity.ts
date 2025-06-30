import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
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
    name: 'reservation_id', // Spécifier le nom de colonne explicitement
  })
  @ApiProperty({
    description: 'ID de la réservation associée',
    example: 1,
  })
  reservationId: number;

  @ManyToOne(() => ReservationEntity, (reservation) => reservation.id)
  @JoinColumn({ name: 'reservation_id' }) // Utiliser le nom de colonne DB
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

  @Column({ type: 'timestamp', name: 'notification_date' }) // Spécifier le nom de colonne
  @ApiProperty({
    description: 'Date de la notification',
    example: '2025-03-18T10:30:00Z',
  })
  notificationDate: Date;

  @Column({ type: 'boolean', default: false, name: 'is_sent' }) // Spécifier le nom de colonne
  @ApiProperty({
    description: 'Indique si la notification a été envoyée',
    example: false,
  })
  isSent: boolean;
}