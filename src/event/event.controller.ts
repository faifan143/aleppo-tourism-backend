import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CreateEventDto, UpdateEventDto } from './dto';
import { EventService } from './event.service';
import { AdminGuard } from '../auth/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadConfig } from '../shared/file-upload.utils';

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @UseGuards(AdminGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image', fileUploadConfig('./public/uploads/events')))
    async createEvent(
        @Body() createEventDto: CreateEventDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        // If image file is uploaded, process it
        if (file) {
            const imageUrl = await this.eventService.uploadEventImage(file.path);
            createEventDto.image = imageUrl;
        }

        return this.eventService.createEvent(createEventDto);
    }

    @Get()
    async getAllEvents() {
        return this.eventService.getAllEvents();
    }

    @Get('place/:tourismPlaceId')
    async getEventsByPlaceId(@Param('tourismPlaceId') tourismPlaceId: string) {
        return this.eventService.getEventsByPlaceId(parseInt(tourismPlaceId));
    }

    @Get('upcoming')
    async getUpcomingEvents() {
        return this.eventService.getUpcomingEvents();
    }

    @Get(':id')
    async getEventById(@Param('id') id: string) {
        return this.eventService.getEventById(parseInt(id));
    }

    @UseGuards(AdminGuard)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image', fileUploadConfig('./public/uploads/events')))
    async updateEvent(
        @Param('id') id: string,
        @Body() updateEventDto: UpdateEventDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        // If image file is uploaded, process it
        if (file) {
            const imageUrl = await this.eventService.uploadEventImage(file.path);
            updateEventDto.image = imageUrl;
        }

        return this.eventService.updateEvent(parseInt(id), updateEventDto);
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    async deleteEvent(@Param('id') id: string) {
        return this.eventService.deleteEvent(parseInt(id));
    }
} 