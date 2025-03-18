import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RoomEntity } from 'src/entities/room.entity';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() room: RoomEntity) {
    return this.roomService.create(room);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @Patch(':id') // Use ':id' to indicate the parameter is a path parameter
  update(@Param('id') id: string, @Body() room: RoomEntity) {
    return this.roomService.update(+id, room);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // Use ':id' to indicate the parameter is a path parameter
    return this.roomService.remove(+id);
  }
}
