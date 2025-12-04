/*
  Warnings:

  - Added the required column `description` to the `Breakdown` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Breakdown` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Device_ref_key";

-- AlterTable
ALTER TABLE "Breakdown" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
