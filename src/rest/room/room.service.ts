import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
  ) {}

  async create(room: RoomEntity): Promise<RoomEntity> {
    return this.roomRepository.save(room);
  }

  async findAll(): Promise<RoomEntity[]> {
    return this.roomRepository.find();
  }

  async findOne(id: number): Promise<RoomEntity> {
    const room = await this.roomRepository.findOne({
      where: { id: id.toString() },
    });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room; // Ensure to return the room
  }

  async update(
    id: number,
    updateData: Partial<RoomEntity>,
  ): Promise<RoomEntity> {
    await this.roomRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.roomRepository.delete(id);
  }
}
