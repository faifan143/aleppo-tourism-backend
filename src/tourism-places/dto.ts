import { PlaceCategory } from '@prisma/client';

export class CreateTourismPlaceDto {
  name: string;
  description: string;
  category: PlaceCategory;
  expectedPeakTime: string;
  visitTimeRange?: string;
  visitTimeStart?: string;
  visitTimeEnd?: string;
  latitude: string;
  longitude: string;
  coverImage: string;
  adminId: string;
}

export class UpdateTourismPlaceDto {
  name?: string;
  description?: string;
  category?: PlaceCategory;
  expectedPeakTime?: string;
  visitTimeRange?: string;
  visitTimeStart?: string;
  visitTimeEnd?: string;
  latitude?: string;
  longitude?: string;
  coverImage?: string;
  adminId?: string;
}
