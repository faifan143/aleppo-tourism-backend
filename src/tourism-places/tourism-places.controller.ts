import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateTourismPlaceDto, UpdateTourismPlaceDto } from './dto';
import { TourismPlacesService } from './tourism-places.service';

@Controller('tourism-places')
export class TourismPlacesController {
  constructor(private readonly tourismPlacesService: TourismPlacesService) {}

  // Create a new tourism place
  @Post('create')
  @UseInterceptors(
    FileInterceptor('coverImage', {
      storage: diskStorage({
        destination: './public/uploads/photos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              'Unsupported file type. Only JPEG, JPG, and PNG are allowed.',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
  )
  async createPlace(
    @Body() createTourismPlaceDto: CreateTourismPlaceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException(
        'Cover image is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Upload to Cloudinary
    const cloudinaryUrl =
      await this.tourismPlacesService.uploadCoverImageToCloudinary(file.path);

    return this.tourismPlacesService.createPlace({
      ...createTourismPlaceDto,
      coverImage: cloudinaryUrl,
    });
  }

  // Update a tourism place
  @Patch('update/:id')
  async updatePlace(
    @Param('id') id: string,
    @Body() updateTourismPlaceDto: UpdateTourismPlaceDto,
  ) {
    return this.tourismPlacesService.updatePlace(
      parseInt(id),
      updateTourismPlaceDto,
    );
  }

  // Add multiple photos to a tourism place
  @Post(':id/photos')
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './public/uploads/photos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              'Unsupported file type. Only JPEG, JPG, and PNG are allowed.',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
  )
  async addPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }

    const uploadedUrls = await Promise.all(
      files.map((file) =>
        this.tourismPlacesService.uploadPhotoToCloudinary(file.path),
      ),
    );

    return this.tourismPlacesService.addPhotosToPlace(
      parseInt(id, 10),
      uploadedUrls,
    );
  }

  // Delete a tourism place
  @Delete('delete/:id')
  async deletePlace(@Param('id') id: string) {
    return this.tourismPlacesService.deletePlace(id);
  }

  // Get all tourism places
  @Get()
  async getAllPlaces() {
    return this.tourismPlacesService.getAllPlaces();
  }
}
