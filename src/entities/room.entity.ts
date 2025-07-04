import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({
    description: 'Localisation de la chambre',
    example: 'Aile Est, 3ème étage',
    required: false,
  })
  location?: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({
    description: 'Date de création',
    example: '2025-03-18T10:30:00Z',
  })
  createdAt: Date;
}