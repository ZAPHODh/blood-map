/*
  Warnings:

  - Added the required column `time` to the `Reading` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reading" ADD COLUMN     "time" TEXT NOT NULL;
