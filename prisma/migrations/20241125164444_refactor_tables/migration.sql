/*
  Warnings:

  - You are about to drop the column `courseId` on the `roadmaps` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `roadmaps` DROP FOREIGN KEY `roadmaps_courseId_fkey`;

-- AlterTable
ALTER TABLE `roadmaps` DROP COLUMN `courseId`;

-- CreateTable
CREATE TABLE `roadmap_courses` (
    `roadmap_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roadmap_courses_roadmap_id_key`(`roadmap_id`),
    UNIQUE INDEX `roadmap_courses_course_id_key`(`course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `roadmap_courses` ADD CONSTRAINT `roadmap_courses_roadmap_id_fkey` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmaps`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roadmap_courses` ADD CONSTRAINT `roadmap_courses_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
