/*
  Warnings:

  - Added the required column `createdAt` to the `Breakdown` table without a default value. This is not possible if the table is not empty.
  - Added the required column `takenAt` to the `Breakdown` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Breakdown" ADD COLUMN     "createdAt" DATE NOT NULL,
ADD COLUMN     "takenAt" DATE NOT NULL;
