import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'ID unique de la chambre',
    example: '1',
  })
  id: string;

  @Column({
    type: 'varchar',
  })
  @ApiProperty({
    description: 'Nom de la chambre',
    example: 'Suite Royale',
  })
  name: string;

  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({
    description: 'Capacité de la chambre (nombre de personnes)',
    example: '4',
  })
  capacity: number;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Localisation de la chambre',
    example: 'Aile Est, 3ème étage',
  })
  location: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @ApiProperty({
    description: 'Date de création',
    example: '2025-03-18T10:30:00Z',
  })
  createdAt: Date;
}
