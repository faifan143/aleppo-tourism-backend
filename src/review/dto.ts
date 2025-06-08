import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsInt()
    @IsOptional()
    userId?: number;

    @IsInt()
    @IsNotEmpty()
    tourismPlaceId: number;
}

export class UpdateReviewDto {
    @IsString()
    @IsOptional()
    content?: string;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(5)
    rating?: number;
} 