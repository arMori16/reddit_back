/*
  Warnings:

  - A unique constraint covering the columns `[hashedRT]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashedRT` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hashedRT" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_hashedRT_key" ON "users"("hashedRT");
