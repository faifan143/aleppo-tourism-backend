import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    Request,
    ValidationPipe
} from '@nestjs/common';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/user.guard';

@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createReview(@Body(ValidationPipe) createReviewDto: CreateReviewDto, @Request() req) {
        // Override userId with the authenticated user's ID
        const userId = req.user.id;
        console.log('Request user:', req.user);
        console.log('Using user ID:', userId);

        // Construct a new DTO with all required fields
        const reviewData = {
            content: createReviewDto.content,
            rating: createReviewDto.rating,
            tourismPlaceId: createReviewDto.tourismPlaceId,
            userId
        };

        return this.reviewService.createReview(reviewData);
    }

    @Get('place/:tourismPlaceId')
    async getReviewsByPlaceId(@Param('tourismPlaceId') tourismPlaceId: string) {
        return this.reviewService.getReviewsByPlaceId(parseInt(tourismPlaceId));
    }

    @Get('user/:userId')
    async getReviewsByUserId(@Param('userId') userId: string) {
        return this.reviewService.getReviewsByUserId(parseInt(userId));
    }

    @Get(':id')
    async getReviewById(@Param('id') id: string) {
        return this.reviewService.getReviewById(parseInt(id));
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateReview(
        @Param('id') id: string,
        @Body(ValidationPipe) updateReviewDto: UpdateReviewDto,
        @Request() req
    ) {
        const userId = req.user.id;
        console.log('Request user:', req.user);
        console.log('Using user ID for update:', userId);
        return this.reviewService.updateReview(
            parseInt(id),
            userId,
            updateReviewDto,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteReview(
        @Param('id') id: string,
        @Request() req
    ) {
        const userId = req.user.id;
        console.log('Request user:', req.user);
        console.log('Using user ID for delete:', userId);
        return this.reviewService.deleteReview(parseInt(id), userId);
    }
} 