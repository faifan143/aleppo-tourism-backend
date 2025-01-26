import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTourismPlaceDto, UpdateTourismPlaceDto } from './dto';
import { PrismaService } from 'src/auth/prisma.service';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TourismPlacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async createPlace(createTourismPlaceDto: CreateTourismPlaceDto) {
    const { name, description, latitude, longitude, coverImage, adminId } =
      createTourismPlaceDto;

    const admin = await this.prisma.admin.findUnique({
      where: { id: parseInt(adminId) },
    });
    if (!admin) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.tourismPlace.create({
      data: {
        name,
        description,
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

    console.log(updateTourismPlaceDto.coverImage);

    // Filter out undefined or null values and ensure types match Prisma schema
    const filteredData = Object.entries(updateTourismPlaceDto).reduce(
      (obj, [key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'latitude' || key === 'longitude') {
            obj[key] = parseFloat(value as string); // Parse latitude/longitude as number
          } else {
            obj[key] = value; // Keep other fields as they are
          }
        }
        return obj;
      },
      {} as Prisma.TourismPlaceUpdateInput,
    );

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
      },
    });
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
