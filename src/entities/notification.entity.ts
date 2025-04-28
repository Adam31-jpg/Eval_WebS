import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
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
  reservationId: number;

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

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @ApiProperty({
    description: 'Date de la notification',
    example: '2025-03-18T10:30:00Z',
  })
  notificationDate: Date;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    description: 'Indique si la notification a été envoyée',
    example: false,
  })
  isSent: boolean;
}
