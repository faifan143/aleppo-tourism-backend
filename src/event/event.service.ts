import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto';
import { CloudinaryService } from 'src/shared/cloudinary.service';

@Injectable()
export class EventService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinary: CloudinaryService,
    ) { }

    async uploadEventImage(filePath: string): Promise<string> {
        return this.cloudinary.uploadImage(filePath, 'tourism-events');
    }

    async createEvent(createEventDto: CreateEventDto) {
        const { name, description, startDate, endDate, tourismPlaceId, image } = createEventDto;

        // Ensure tourismPlaceId is a number
        const placeId = typeof tourismPlaceId === 'string' ? parseInt(tourismPlaceId, 10) : tourismPlaceId;

        // Check if tourism place exists
        const place = await this.prisma.tourismPlace.findUnique({
            where: { id: placeId },
        });

        if (!place) {
            throw new HttpException('Tourism place not found', HttpStatus.NOT_FOUND);
        }

        // Check if end date is after start date
        if (new Date(endDate) <= new Date(startDate)) {
            throw new HttpException(
                'End date must be after start date',
                HttpStatus.BAD_REQUEST,
            );
        }

        // Create the event
        return this.prisma.event.create({
            data: {
                name,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                tourismPlaceId: placeId,
                ...(image && { image }),
            },
            include: {
                tourismPlace: true,
            },
        });
    }

    async getAllEvents() {
        // Get all events sorted by start date
        return this.prisma.event.findMany({
            include: {
                tourismPlace: true,
            },
            orderBy: {
                startDate: 'desc',
            },
        });
    }

    async getEventsByPlaceId(tourismPlaceId: number) {
        // Ensure tourismPlaceId is a number
        const placeId = typeof tourismPlaceId === 'string' ? parseInt(tourismPlaceId as string, 10) : tourismPlaceId;

        // Check if tourism place exists
        const place = await this.prisma.tourismPlace.findUnique({
            where: { id: placeId },
        });

        if (!place) {
            throw new HttpException('Tourism place not found', HttpStatus.NOT_FOUND);
        }

        // Get all events for this place
        return this.prisma.event.findMany({
            where: { tourismPlaceId: placeId },
            orderBy: {
                startDate: 'asc',
            },
        });
    }

    async getUpcomingEvents() {
        // Get all upcoming events (events with start date after now)
        return this.prisma.event.findMany({
            where: {
                startDate: {
                    gte: new Date(),
                },
            },
            include: {
                tourismPlace: true,
            },
            orderBy: {
                startDate: 'asc',
            },
        });
    }

    async getEventById(id: number) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                tourismPlace: true,
            },
        });

        if (!event) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        }

        return event;
    }

    async updateEvent(id: number, updateEventDto: UpdateEventDto) {
        // Check if event exists
        const event = await this.prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        }

        // If both start and end dates are provided, check if end date is after start date
        if (updateEventDto.startDate && updateEventDto.endDate) {
            if (new Date(updateEventDto.endDate) <= new Date(updateEventDto.startDate)) {
                throw new HttpException(
                    'End date must be after start date',
                    HttpStatus.BAD_REQUEST,
                );
            }
        } else if (updateEventDto.startDate && !updateEventDto.endDate) {
            // If only start date is provided, check if it's before the existing end date
            if (new Date(updateEventDto.startDate) >= new Date(event.endDate)) {
                throw new HttpException(
                    'Start date must be before end date',
                    HttpStatus.BAD_REQUEST,
                );
            }
        } else if (!updateEventDto.startDate && updateEventDto.endDate) {
            // If only end date is provided, check if it's after the existing start date
            if (new Date(updateEventDto.endDate) <= new Date(event.startDate)) {
                throw new HttpException(
                    'End date must be after start date',
                    HttpStatus.BAD_REQUEST,
                );
            }
        }

        // Update the event
        return this.prisma.event.update({
            where: { id },
            data: {
                name: updateEventDto.name,
                description: updateEventDto.description,
                startDate: updateEventDto.startDate ? new Date(updateEventDto.startDate) : undefined,
                endDate: updateEventDto.endDate ? new Date(updateEventDto.endDate) : undefined,
                image: updateEventDto.image,
            },
            include: {
                tourismPlace: true,
            },
        });
    }

    async deleteEvent(id: number) {
        // Check if event exists
        const event = await this.prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        }

        // Delete the event
        return this.prisma.event.delete({
            where: { id },
        });
    }
} 