-- DropForeignKey
ALTER TABLE `tourism_photos` DROP FOREIGN KEY `tourism_photos_tourismPlaceId_fkey`;

-- DropIndex
DROP INDEX `tourism_photos_tourismPlaceId_fkey` ON `tourism_photos`;

-- AddForeignKey
ALTER TABLE `tourism_photos` ADD CONSTRAINT `tourism_photos_tourismPlaceId_fkey` FOREIGN KEY (`tourismPlaceId`) REFERENCES `tourism_places`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
