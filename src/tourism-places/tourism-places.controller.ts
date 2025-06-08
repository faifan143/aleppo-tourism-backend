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
import { CreateTourismPlaceDto, UpdateTourismPlaceDto } from './dto';
import { TourismPlacesService } from './tourism-places.service';
import { fileUploadConfig } from '../shared/file-upload.utils';

@Controller('tourism-places')
export class TourismPlacesController {
  constructor(private readonly tourismPlacesService: TourismPlacesService) { }

  // Create a new tourism place
  @Post('create')
  @UseInterceptors(FileInterceptor('coverImage', fileUploadConfig()))
  async createPlace(
    @Body() createTourismPlaceDto: CreateTourismPlaceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Debug what we're receiving
    console.log("Received create place request with data:", JSON.stringify(createTourismPlaceDto));
    console.log("AdminId present:", !!createTourismPlaceDto.adminId);

    if (!file) {
      throw new HttpException(
        'Cover image is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Upload to Cloudinary
    const cloudinaryUrl =
      await this.tourismPlacesService.uploadCoverImageToCloudinary(file.path);

    // Add adminId if it's missing (temporary workaround)
    if (!createTourismPlaceDto.adminId) {
      console.log("Adding default adminId");
      createTourismPlaceDto.adminId = "1";
    }

    return this.tourismPlacesService.createPlace({
      ...createTourismPlaceDto,
      coverImage: cloudinaryUrl,
    });
  }

  // Update a tourism place
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('coverImage', fileUploadConfig()))
  async updatePlace(
    @Param('id') id: string,
    @Body() updateTourismPlaceDto: UpdateTourismPlaceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // If a file is provided, upload it to Cloudinary and update the coverImage field
    if (file) {
      const cloudinaryUrl =
        await this.tourismPlacesService.uploadCoverImageToCloudinary(file.path);
      updateTourismPlaceDto.coverImage = cloudinaryUrl;
    }

    return this.tourismPlacesService.updatePlace(
      parseInt(id),
      updateTourismPlaceDto,
    );
  }

  // Add multiple photos to a tourism place
  @Post(':id/photos')
  @UseInterceptors(FilesInterceptor('photos', 10, fileUploadConfig()))
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

  // Get a tourism place by ID
  @Get(':id')
  async getPlaceById(@Param('id') id: string) {
    return this.tourismPlacesService.getPlaceById(parseInt(id));
  }
}
