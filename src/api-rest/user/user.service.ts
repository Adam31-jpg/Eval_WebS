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

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findAll(skip: number = 0, limit: number = 10): Promise<UserEntity[]> {
    return this.userRepository.find({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: id.toString() },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(
    id: number,
    updateData: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const user = await this.findOne(id); // Vérifier que l'utilisateur existe
    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id); // Vérifier que l'utilisateur existe
    await this.userRepository.delete(id);
  }
}