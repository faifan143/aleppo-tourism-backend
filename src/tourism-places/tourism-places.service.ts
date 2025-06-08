import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTourismPlaceDto, UpdateTourismPlaceDto } from './dto';
import { PrismaService } from 'src/auth/prisma.service';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { Prisma, PlaceCategory } from '@prisma/client';

@Injectable()
export class TourismPlacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) { }

  async createPlace(createTourismPlaceDto: CreateTourismPlaceDto) {
    const {
      name,
      description,
      category,
      expectedPeakTime,
      visitTimeRange,
      latitude,
      longitude,
      coverImage,
      adminId
    } = createTourismPlaceDto;

    // Validate the category
    let validCategory: PlaceCategory;

    // Handle string values for category (from form data)
    const categoryStr = String(category);

    if (categoryStr === 'HISTORICAL') {
      console.log('Mapping HISTORICAL to ARCHAEOLOGICAL');
      validCategory = PlaceCategory.ARCHAEOLOGICAL;
    } else if (Object.values(PlaceCategory).includes(category as PlaceCategory)) {
      validCategory = category as PlaceCategory;
    } else {
      console.log(`Unknown category "${categoryStr}", defaulting to ENTERTAINMENT`);
      validCategory = PlaceCategory.ENTERTAINMENT;
    }

    // Check if adminId exists
    if (!adminId) {
      throw new HttpException('Admin ID is required', HttpStatus.BAD_REQUEST);
    }

    console.log("Processing request with adminId:", adminId);

    try {
      const admin = await this.prisma.admin.findUnique({
        where: { id: parseInt(adminId) },
      });

      if (!admin) {
        throw new HttpException(`Admin with ID ${adminId} not found`, HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error finding admin:", error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(`Error processing admin ID: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
    // Admin check is now handled in the try/catch block above

    return this.prisma.tourismPlace.create({
      data: {
        name,
        description,
        category: validCategory,
        expectedPeakTime,
        visitTimeRange,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        coverImage,
        adminId: parseInt(adminId),
      },
    });
  }

  async updatePlace(id: number, updateTourismPlaceDto: UpdateTourismPlaceDto) {
    const place = await this.prisma.tourismPlace.findUnique({ where: { id } });
    if (!place) {
      throw new HttpException('Tourism place not found', HttpStatus.NOT_FOUND);
    }

    // Filter out undefined or null values and ensure types match Prisma schema
    const filteredData = Object.entries(updateTourismPlaceDto).reduce(
      (obj, [key, value]) => {
        // Skip relation fields and non-schema fields to avoid Prisma errors
        if (['photos', 'events', 'reviews', 'visitTimeStart', 'visitTimeEnd'].includes(key)) {
          return obj;
        }

        if (value !== undefined && value !== null) {
          if (key === 'latitude' || key === 'longitude') {
            obj[key] = parseFloat(value as string); // Parse latitude/longitude as number
          } else if (key === 'adminId' && value) {
            obj[key] = parseInt(value as string); // Parse adminId as number
          } else if (key === 'category' && value === 'HISTORICAL') {
            // Map HISTORICAL to ARCHAEOLOGICAL for consistency
            obj[key] = PlaceCategory.ARCHAEOLOGICAL;
          } else {
            obj[key] = value; // Keep other fields as they are
          }
        }
        return obj;
      },
      {} as Prisma.TourismPlaceUpdateInput,
    );

    // Handle visitTimeStart and visitTimeEnd if provided in the form
    if (updateTourismPlaceDto.visitTimeStart && updateTourismPlaceDto.visitTimeEnd) {
      // Set visitTimeRange with formatted time range
      filteredData.visitTimeRange = `${updateTourismPlaceDto.visitTimeStart} - ${updateTourismPlaceDto.visitTimeEnd}`;
    }

    console.log('Updating place with data:', filteredData);

    return this.prisma.tourismPlace.update({
      where: { id },
      data: filteredData,
    });
  }

  async deletePlace(id: string) {
    const place = await this.prisma.tourismPlace.findUnique({
      where: { id: parseInt(id) },
    });
    if (!place) {
      throw new HttpException('Tourism place not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.tourismPlace.delete({ where: { id: parseInt(id) } });
  }

  async getAllPlaces() {
    return this.prisma.tourismPlace.findMany({
      include: {
        photos: true,
        events: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async getPlaceById(id: number) {
    const place = await this.prisma.tourismPlace.findUnique({
      where: { id },
      include: {
        photos: true,
        events: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!place) {
      throw new HttpException('Tourism place not found', HttpStatus.NOT_FOUND);
    }

    return place;
  }

  async addPhotosToPlace(tourismPlaceId: number, photoUrls: string[]) {
    const place = await this.prisma.tourismPlace.findUnique({
      where: { id: tourismPlaceId },
    });

    if (!place) {
      throw new HttpException('Tourism place not found', HttpStatus.NOT_FOUND);
    }

    const photoData = photoUrls.map((url) => ({
      url,
      tourismPlaceId,
    }));

    await this.prisma.tourismPhoto.createMany({
      data: photoData,
    });

    return {
      message: 'Photos added successfully',
      photoUrls,
    };
  }

  async uploadCoverImageToCloudinary(filePath: string): Promise<string> {
    return this.cloudinary.uploadImage(filePath, 'tourism-places/cover-images');
  }

  async uploadPhotoToCloudinary(filePath: string): Promise<string> {
    return this.cloudinary.uploadImage(filePath, 'tourism-places/photos');
  }
}
