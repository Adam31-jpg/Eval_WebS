// src/api-rest/room/room.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../../entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
  ) { }

  async create(roomData: any): Promise<any> {
    console.log('📝 Création room avec données:', roomData);

    const room = this.roomRepository.create(roomData);
    const savedRoom = await this.roomRepository.save(room);

    console.log('💾 Room sauvegardée:', savedRoom);

    // CORRECTION: Transformer en camelCase pour l'API
    return this.transformToApiFormat(Array.isArray(savedRoom) ? savedRoom[0] : savedRoom);
  }

  async findAll(skip: number = 0, limit: number = 10): Promise<any[]> {
    const rooms = await this.roomRepository.find({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    // CORRECTION: Transformer toutes les rooms en camelCase
    return rooms.map(room => this.transformToApiFormat(room));
  }

  async findOne(id: number): Promise<any> {
    const room = await this.roomRepository.findOne({
      where: { id: id.toString() },
    });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    // CORRECTION: Transformer en camelCase
    return this.transformToApiFormat(room);
  }

  async update(
    id: number,
    updateData: Partial<RoomEntity>,
  ): Promise<any> {
    console.log(`📝 Mise à jour room ${id} avec:`, updateData);

    // Vérifier que la room existe
    const existingRoom = await this.roomRepository.findOne({
      where: { id: id.toString() },
    });

    if (!existingRoom) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    // CORRECTION: Utiliser save() au lieu d'update() pour garantir la cohérence
    const updatedRoom = {
      ...existingRoom,
      ...updateData,
      // S'assurer que l'ID reste un number
      id: existingRoom.id
    };

    const result = await this.roomRepository.save(updatedRoom);
    console.log('✅ Room mise à jour:', result);

    // CORRECTION: Transformer en camelCase
    return this.transformToApiFormat(result);
  }

  async remove(id: number): Promise<void> {
    const room = await this.roomRepository.findOne({
      where: { id: id.toString() },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    await this.roomRepository.delete(id);
  }

  // NOUVELLE MÉTHODE: Transformer les données DB (snake_case) en format API (camelCase)
  private transformToApiFormat(room: RoomEntity): any {
    if (!room) return null;

    return {
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      location: room.location,
      createdAt: room.createdAt,    // CORRECTION: camelCase au lieu de created_at
    };
  }
}