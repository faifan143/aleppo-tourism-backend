export class CreateTourismPlaceDto {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  coverImage: string;
  adminId: string;
}

export class UpdateTourismPlaceDto {
  name?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  coverImage?: string;
}
