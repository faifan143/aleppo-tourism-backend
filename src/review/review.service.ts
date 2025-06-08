import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';

@Injectable()
export class ReviewService {
    constructor(private readonly prisma: PrismaService) { }

    async createReview(createReviewDto: CreateReviewDto) {
        const { content, rating, userId, tourismPlaceId } = createReviewDto;

        // Check if user exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        // Check if tourism place exists
        const place = await this.prisma.tourismPlace.findUnique({
            where: { id: tourismPlaceId },
        });

        if (!place) {
            throw new HttpException('Tourism place not found', HttpStatus.NOT_FOUND);
        }

        // Create the review
        return this.prisma.review.create({
            data: {
                content,
                rating,
                userId,
                tourismPlaceId,
            },
            include: {
                user: true,
                tourismPlace: true,
            },
        });
    }

    async getReviewsByPlaceId(tourismPlaceId: number) {
        // Check if tourism place exists
        const place = await this.prisma.tourismPlace.findUnique({
            where: { id: tourismPlaceId },
        });

        if (!place) {
            throw new HttpException('Tourism place not found', HttpStatus.NOT_FOUND);
        }

        // Get all reviews for this place
        return this.prisma.review.findMany({
            where: { tourismPlaceId },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getReviewById(id: number) {
        const review = await this.prisma.review.findUnique({
            where: { id },
            include: {
                user: true,
                tourismPlace: true,
            },
        });

        if (!review) {
            throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
        }

        return review;
    }

    async getReviewsByUserId(userId: number) {
        // Check if user exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        // Get all reviews by this user
        return this.prisma.review.findMany({
            where: { userId },
            include: {
                tourismPlace: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async updateReview(id: number, userId: number, updateReviewDto: UpdateReviewDto) {
        // Check if review exists and belongs to the user
        const review = await this.prisma.review.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!review) {
            throw new HttpException(
                'Review not found or you are not authorized to update it',
                HttpStatus.NOT_FOUND,
            );
        }

        // Update the review
        return this.prisma.review.update({
            where: { id },
            data: updateReviewDto,
            include: {
                user: true,
                tourismPlace: true,
            },
        });
    }

    async deleteReview(id: number, userId: number) {
        // Check if review exists and belongs to the user
        const review = await this.prisma.review.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!review) {
            throw new HttpException(
                'Review not found or you are not authorized to delete it',
                HttpStatus.NOT_FOUND,
            );
        }

        // Delete the review
        return this.prisma.review.delete({
            where: { id },
        });
    }
} 