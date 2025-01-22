-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT;
