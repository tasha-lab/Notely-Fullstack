/*
  Warnings:

  - You are about to drop the column `pinned` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `private` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `public` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pinned",
DROP COLUMN "private",
DROP COLUMN "public";
