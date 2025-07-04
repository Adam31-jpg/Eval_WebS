// src/api-rest/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  async create(user: Partial<UserEntity>): Promise<any> {
    console.log('📝 Création utilisateur avec données:', user);

    const newUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);

    console.log('💾 Utilisateur sauvegardé:', savedUser);

    // CORRECTION: Transformer en camelCase pour l'API
    return this.transformToApiFormat(savedUser);
  }

  async findAll(skip: number = 0, limit: number = 10): Promise<any[]> {
    const users = await this.userRepository.find({
      skip,
      take: limit,
      order: { created_at: 'DESC' }, // CORRECTION: utiliser createdAt au lieu de created_at
    });

    // CORRECTION: Transformer tous les utilisateurs en camelCase
    return users.map(user => this.transformToApiFormat(user));
  }

  async findOne(id: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: id.toString() },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // CORRECTION: Transformer en camelCase
    return this.transformToApiFormat(user);
  }

  async update(
    id: number,
    updateData: Partial<UserEntity>,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: id.toString() },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.update(id, updateData);
    const updatedUser = await this.userRepository.findOne({
      where: { id: id.toString() },
    });

    // CORRECTION: Transformer en camelCase
    return this.transformToApiFormat(updatedUser as UserEntity);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: id.toString() },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.delete(id);
  }

  // NOUVELLE MÉTHODE: Transformer les données DB (snake_case) en format API (camelCase)
  private transformToApiFormat(user: UserEntity): any {
    if (!user) return null;

    return {
      id: user.id,
      keycloakId: user.keycloakId,  // déjà en camelCase
      email: user.email,
      createdAt: user.created_at,    // CORRECTION: camelCase au lieu de created_at
      updatedAt: user.updated_at     // CORRECTION: camelCase au lieu de updated_at (si elle existe)
    };
  }
}