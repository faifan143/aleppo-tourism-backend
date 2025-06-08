import { PrismaClient, PlaceCategory } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean up existing data
  await prisma.review.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.tourismPhoto.deleteMany({});
  await prisma.tourismPlace.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.admin.deleteMany({});

  console.log('Database cleaned');

  // Create default admin if it doesn't exist
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@example.com' }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcryptjs.hash('admin123', 10);

    await prisma.admin.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
      }
    });

    console.log('Created default admin: admin@example.com / admin123');
  } else {
    console.log('Default admin already exists');
  }

  // Create default user if it doesn't exist
  const existingUser = await prisma.user.findUnique({
    where: { email: 'user@example.com' }
  });

  if (!existingUser) {
    const hashedPassword = await bcryptjs.hash('user123', 10);

    await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'user@example.com',
        password: hashedPassword,
      }
    });

    console.log('Created default user: user@example.com / user123');
  } else {
    console.log('Default user already exists');
  }

  // Create users
  const userPassword = await bcryptjs.hash('user123', 10);

  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: userPassword,
    },
  });

  console.log(`Created users with ids: ${user1.id}, ${user2.id}`);

  // Create tourism places
  const place1 = await prisma.tourismPlace.create({
    data: {
      name: 'الأهرامات',
      description: 'أهرامات الجيزة، أحد عجائب الدنيا السبع، وهي من أقدم الآثار في العالم.',
      category: PlaceCategory.ARCHAEOLOGICAL,
      expectedPeakTime: 'Morning',
      visitTimeRange: '8:00 AM - 5:00 PM',
      latitude: 29.9792,
      longitude: 31.1342,
      coverImage: 'https://res.cloudinary.com/dkxuf7w3l/image/upload/v1625432896/tourism-places/cover-images/pyramids.jpg',
      adminId: existingAdmin.id,
      photos: {
        create: [
          {
            url: 'https://res.cloudinary.com/dkxuf7w3l/image/upload/v1625432896/tourism-places/photos/pyramids1.jpg',
          },
          {
            url: 'https://res.cloudinary.com/dkxuf7w3l/image/upload/v1625432896/tourism-places/photos/pyramids2.jpg',
          },
        ],
      },
    },
  });

  const place2 = await prisma.tourismPlace.create({
    data: {
      name: 'مسجد محمد علي',
      description: 'مسجد محمد علي باشا بقلعة صلاح الدين، أحد أشهر المعالم الإسلامية في مصر.',
      category: PlaceCategory.RELIGIOUS,
      expectedPeakTime: 'Afternoon',
      visitTimeRange: '9:00 AM - 6:00 PM',
      latitude: 30.0290,
      longitude: 31.2599,
      coverImage: 'https://res.cloudinary.com/dkxuf7w3l/image/upload/v1625432896/tourism-places/cover-images/mosque.jpg',
      adminId: existingAdmin.id,
      photos: {
        create: [
          {
            url: 'https://res.cloudinary.com/dkxuf7w3l/image/upload/v1625432896/tourism-places/photos/mosque1.jpg',
          },
        ],
      },
    },
  });

  const place3 = await prisma.tourismPlace.create({
    data: {
      name: 'مطعم أبو طارق',
      description: 'مطعم يقدم أشهى المأكولات المصرية التقليدية بأسعار معقولة.',
      category: PlaceCategory.RESTAURANT,
      expectedPeakTime: 'Evening',
      visitTimeRange: '12:00 PM - 12:00 AM',
      latitude: 30.0444,
      longitude: 31.2357,
      coverImage: 'https://res.cloudinary.com/dkxuf7w3l/image/upload/v1625432896/tourism-places/cover-images/restaurant.jpg',
      adminId: existingAdmin.id,
    },
  });

  console.log(`Created tourism places with ids: ${place1.id}, ${place2.id}, ${place3.id}`);

  // Create reviews
  const review1 = await prisma.review.create({
    data: {
      content: 'مكان رائع، أنصح بزيارته.',
      rating: 5,
      userId: user1.id,
      tourismPlaceId: place1.id,
    },
  });

  const review2 = await prisma.review.create({
    data: {
      content: 'تجربة جيدة ولكن الزحام كان كثيراً.',
      rating: 4,
      userId: user2.id,
      tourismPlaceId: place1.id,
    },
  });

  const review3 = await prisma.review.create({
    data: {
      content: 'مكان مقدس وجميل.',
      rating: 5,
      userId: user1.id,
      tourismPlaceId: place2.id,
    },
  });

  console.log(`Created reviews with ids: ${review1.id}, ${review2.id}, ${review3.id}`);

  // Create events
  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const event1 = await prisma.event.create({
    data: {
      name: 'مهرجان الشمس',
      description: 'حدث سنوي يقام في الأهرامات حيث تشرق الشمس من بين الأهرامات.',
      startDate: nextWeek,
      endDate: new Date(nextWeek.getTime() + 24 * 60 * 60 * 1000), // Next day
      tourismPlaceId: place1.id,
      image: 'https://res.cloudinary.com/dkxuf7w3l/image/upload/v1625432896/tourism-events/event1.jpg',
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: 'معرض الفن الإسلامي',
      description: 'معرض للفن الإسلامي في مسجد محمد علي.',
      startDate: nextMonth,
      endDate: new Date(nextMonth.getTime() + 7 * 24 * 60 * 60 * 1000), // Week long
      tourismPlaceId: place2.id,
      image: 'https://res.cloudinary.com/dkxuf7w3l/image/upload/v1625432896/tourism-events/event2.jpg',
    },
  });

  console.log(`Created events with ids: ${event1.id}, ${event2.id}`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
