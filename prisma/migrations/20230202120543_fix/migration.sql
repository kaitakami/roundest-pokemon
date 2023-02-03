/*
  Warnings:

  - You are about to drop the column `SpriteUrl` on the `Pokemon` table. All the data in the column will be lost.
  - Added the required column `spriteUrl` to the `Pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "SpriteUrl",
ADD COLUMN     "spriteUrl" TEXT NOT NULL;
