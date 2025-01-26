import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function main() {
  // Reset the database and apply migrations
  resetDatabase();

  // Seed the database
  const { admin1, admin2 } = await createAdmins();
  await createTourismPlaces();
  await photosForTourismPlaces();

  function resetDatabase() {
    try {
      console.log('Resetting the database...');
      execSync('npx prisma migrate reset --force --skip-seed');
      console.log('Database reset and migrations applied successfully 🚀');
    } catch (error) {
      console.error('Error resetting the database:', error);
      process.exit(1);
    }
  }

  async function createAdmins() {
    // Hash passwords
    const hashedPassword1 = await bcrypt.hash('securepassword123', 10);
    const hashedPassword2 = await bcrypt.hash('anothersecurepassword456', 10);

    // Create Admins
    const admin1 = await prisma.admin.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: hashedPassword1,
      },
    });

    const admin2 = await prisma.admin.create({
      data: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: hashedPassword2,
      },
    });

    console.log('Admins Added Successfully 🚀');

    return { admin1, admin2 };
  }

  async function createTourismPlaces() {
    const x = await prisma.tourismPlace.createMany({
      data: [
        {
          name: 'قلعة حلب',
          description:
            'قلعة حلب هي قلعة تاريخية تقع في مدينة حلب، سوريا. تعتبر من أقدم وأكبر القلاع في العالم، وقد تم تشييدها على تل طبيعي يرتفع حوالي 50 متراً عن مستوى المدينة.',
          latitude: 36.1981,
          longitude: 37.1637,
          coverImage:
            'https://upload.wikimedia.org/wikipedia/commons/5/54/Citadel_of_Aleppo.jpg',
          adminId: admin1.id,
        },
        {
          name: 'جامع حلب الكبير',
          description:
            'الجامع الأموي الكبير في حلب هو أحد أكبر وأقدم المساجد في المدينة. يتميز بمئذنته الفريدة وزخارفه الإسلامية الرائعة.',
          latitude: 36.1995,
          longitude: 37.1553,
          coverImage:
            'https://lisa.gerda-henkel-stiftung.de/publikationen/aleppo/binaries/content/9735/1._great_mosque__courtyard__view_towards_northwest_syrian_he_1440x8001e64.jpg?t=1537022752',
          adminId: admin1.id,
        },
        {
          name: 'سوق المدينة',
          description:
            'أسواق حلب القديمة هي من أقدم وأطول الأسواق المسقوفة في العالم. تمتد لمسافة 13 كيلومتراً وتضم العديد من الخانات والأسواق التاريخية.',
          latitude: 36.1987,
          longitude: 37.1545,
          coverImage:
            'https://s.mc-doualiya.com/media/display/2539b76c-433b-11e9-bc4d-005056bff430/w:1280/p:1x1/aleppe_0.jpg',
          adminId: admin1.id,
        },
        {
          name: 'بيت أجقباش',
          description:
            'بيت أجقباش هو قصر تاريخي يعود للعصر العثماني، يتميز بزخارفه الجميلة وفنائه الداخلي وقاعاته المزينة.',
          latitude: 36.1978,
          longitude: 37.1567,
          coverImage:
            'https://live.staticflickr.com/6185/6077131343_870ba41799_b.jpg',
          adminId: admin1.id,
        },
        {
          name: 'باب قنسرين',
          description:
            'أحد أبواب حلب القديمة التاريخية، يعود تاريخه إلى العصر الأيوبي. يتميز بهندسته المعمارية الفريدة وأهميته التاريخية.',
          latitude: 36.1923,
          longitude: 37.1539,
          coverImage:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlFsJh-PyqT1g0GRxSN2em_amyJxolGRPD7w&s',
          adminId: admin2.id,
        },
        {
          name: 'خان الوزير',
          description:
            'خان تاريخي يعود للعصر العثماني، كان مركزاً تجارياً مهماً. يتميز بعمارته الإسلامية وفنائه الواسع وغرفه التجارية.',
          latitude: 36.1989,
          longitude: 37.1558,
          coverImage:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPS2VSpyqtyBh-TDFg_eAo4kDnfwcb6uWG-w&s',
          adminId: admin2.id,
        },
        {
          name: 'بيت غزالة',
          description:
            'قصر تاريخي يعود للقرن السابع عشر، يعتبر نموذجاً رائعاً للعمارة السكنية في حلب القديمة. يتميز بزخارفه وإيوانه الجميل.',
          latitude: 36.1976,
          longitude: 37.1563,
          coverImage:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcRa4nebQ3YimvN-3C5kdojWGskRCwm8Y4PA&s',
          adminId: admin2.id,
        },
        {
          name: 'مدرسة الفردوس',
          description:
            'مدرسة تاريخية تعود للعصر الأيوبي، تتميز بعمارتها الإسلامية الفريدة وزخارفها وكتاباتها العربية الجميلة.',
          latitude: 36.1957,
          longitude: 37.1545,
          coverImage: 'https://pbs.twimg.com/media/D-DVjq9XkAABrB4.jpg',
          adminId: admin2.id,
        },
        {
          name: 'حمام النحاسين',
          description:
            'حمام تقليدي يعود للعصر المملوكي، يعتبر من أجمل الحمامات التقليدية في حلب القديمة. يتميز بقبابه وزخارفه.',
          latitude: 36.1984,
          longitude: 37.1551,
          coverImage:
            'https://i0.wp.com/alsori.net/wp-content/uploads/2023/11/%D8%AA%D8%A7%D8%B1%D9%8A%D8%AE-%D8%AD%D9%85%D8%BA%D8%A7%D9%85-%D8%A7%D9%84%D9%86%D8%AD%D8%A7%D8%B3%D9%8A%D9%86.jpg?fit=640%2C640&ssl=1',
          adminId: admin2.id,
        },
        {
          name: 'بيت جنبلاط',
          description:
            'قصر تاريخي يعود للقرن الثامن عشر، يعتبر تحفة معمارية تجمع بين الطراز العثماني والعمارة الحلبية التقليدية.',
          latitude: 36.1972,
          longitude: 37.1559,
          coverImage:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Junblatt_palace_Aleppo.jpg/640px-Junblatt_palace_Aleppo.jpg',
          adminId: admin2.id,
        },
      ],
    });

    console.log('تم إضافة الأماكن السياحية بنجاح 🚀');
    return x;
  }

  async function photosForTourismPlaces() {
    const tourismPlaces = await prisma.tourismPlace.findMany();
    const photoUrls = [
      'https://upload.wikimedia.org/wikipedia/commons/',
      'https://upload.wikimedia.org/wikipedia/commons/',
      'https://upload.wikimedia.org/wikipedia/commons/',
    ];
    const photoPromises = tourismPlaces.map((place) =>
      prisma.tourismPhoto.createMany({
        data: photoUrls.map((url, index) => ({
          url: `${url}example_photo_${index + 1}.jpg`,
          tourismPlaceId: place.id,
        })),
      }),
    );
    await Promise.all(photoPromises);
    console.log('Photos Added Successfully 🚀');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
