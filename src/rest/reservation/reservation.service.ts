import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationEntity } from 'src/entities/reservation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private reservationRepository: Repository<ReservationEntity>,
  ) {}

  async create(reservation: ReservationEntity): Promise<ReservationEntity> {
    return this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<ReservationEntity[]> {
    return this.reservationRepository.find();
  }

  async findOne(id: number): Promise<ReservationEntity> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: id.toString() },
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation; // Ensure to return the reservation
  }

  async update(
    id: number,
    updateData: Partial<ReservationEntity>,
  ): Promise<ReservationEntity> {
    await this.reservationRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.reservationRepository.delete(id);
  }
}
