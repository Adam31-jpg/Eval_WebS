import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: "ID unique de l'utilisateur",
    example: '1',
  })
  id?: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  @ApiProperty({
    description: "ID keycloak de l'utilisateur",
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  keycloakId: string;

  @Column({ type: 'varchar', unique: true })
  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'user@example.com',
  })
  email: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @ApiProperty({
    description: 'Date de création du compte',
    example: '2025-03-18T10:30:00Z',
  })
  createdAt: Date;
}
