import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { NotificationEntity } from 'src/entities/notification.entity';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Post()
  create(@Body() createNotificationDto: NotificationEntity) {
    return this.notificationService.create(createNotificationDto);
  }

  @Patch(':id') // Use ':id' to indicate the parameter is a path parameter
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: NotificationEntity,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
