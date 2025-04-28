import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'ID unique de la réservation',
    example: '1',
  })
  id: string;

  @Column({
    type: 'int',
  })
  @ApiProperty({
    description: "ID de l'utilisateur qui a fait la réservation",
    example: 1,
  })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @ApiProperty({
    description: "Données de l'utilisateur",
    type: () => UserEntity,
  })
  user: UserEntity;

  @Column({
    type: 'int',
  })
  @ApiProperty({
    description: 'ID de la chambre réservée',
    example: 1,
  })
  roomId: number;


  @OneToMany(() => RoomEntity, (room) => room.id)
  @ApiProperty({
    description: 'Données de la chambre',
    type: () => RoomEntity,
    required: false,
  })
  room?: RoomEntity;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Localisation de la réservation',
    example: 'Bâtiment A, Paris',
  })
  location: string;

  @Column({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date de création de la réservation',
    example: '2025-03-18T10:30:00Z',
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
  @ApiProperty({
    description: 'Date et heure de début de la réservation',
    example: '2025-04-01T14:00:00Z',
  })
  startTime: Date;

  @Column({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date et heure de fin de la réservation',
    example: '2025-04-01T16:00:00Z',
  })
  endTime: Date;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Statut de la réservation',
    enum: StatusEnum,
    enumName: 'StatusEnum',
    example: StatusEnum.APPROVED,
  })
  status: StatusEnum;
}
