/*
  Warnings:

  - Added the required column `type_doc` to the `docs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `docs` ADD COLUMN `type_doc` VARCHAR(191) NOT NULL;
