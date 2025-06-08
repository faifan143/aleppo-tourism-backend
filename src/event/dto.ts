import { Type } from 'class-transformer';
import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';

export class CreateEventDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @Type(() => Date)
    @IsDate()
    startDate: Date;

    @Type(() => Date)
    @IsDate()
    endDate: Date;

    @Type(() => Number)
    @IsNumber()
    tourismPlaceId: number;

    @IsOptional()
    @IsString()
    image?: string; // URL of the event image/poster
}

export class UpdateEventDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;

    @IsOptional()
    @IsString()
    image?: string; // URL of the event image/poster
} 